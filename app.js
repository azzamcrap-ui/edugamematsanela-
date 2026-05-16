/*
  TK-EDU Game - HTML/CSS/JS
  Copyright © 2026 MTsN 1 Lamongan
  Licensed for educational use.
*/

(() => {
  const $ = (id) => document.getElementById(id);

  // ---------- SFX ----------
  const sfx = {
    start: $("sfx-start"),
    next: $("sfx-next"),
    correct: $("sfx-correct"),
    wrong: $("sfx-wrong"),
    gameover: $("sfx-gameover"),
  };

  let sfxEnabled = true;

  // Some browsers require the audio to be initiated by a user gesture.
  // We'll try to trigger playback from click handlers.

  function playSfx(name) {
    const el = sfx[name];
    if (!sfxEnabled || !el) return;

    try {
      el.pause();
      el.currentTime = 0;
      // autoplay policy: must be triggered by user gesture; this will still fail silently otherwise
      el.play();
    } catch (_) {
      // ignore
    }
  }

  const screens = {

    home: $("screen-home"),
    game: $("screen-game"),
    end: $("screen-end"),
  };

  const scoreEl = $("score");
  const livesEl = $("lives");
  const levelEl = $("level");

  const btnStart = $("btn-start");
  const btnHow = $("btn-how");
  const howBox = $("how-box");

  const playerForm = $("player-form");
  const playerName = $("player-name");
  const playerSchool = $("player-school");

  const homeLastBar = $("home-last-bar");
  const homeLastText = $("home-last-text");


  const questionTitle = $("question-title");
  const tagTheme = $("tag-theme");
  const questionMedia = $("question-media");


  const ansA = $("ans-a");
  const ansB = $("ans-b");
  const ansC = $("ans-c");

  const buttons = Array.from(document.querySelectorAll(".answer"));
  const feedback = $("feedback");
  const btnNext = $("btn-next");
  const btnRestart = $("btn-restart");

  const qIndexEl = $("q-index");
  const qTotalEl = $("q-total");
  const barFill = $("bar-fill");

  const countCorrectEl = $("count-correct");
  const countWrongEl = $("count-wrong");

  const teacherSpeech = $("teacher-speech");
  const timerText = $("timer-text");


  const endTitle = $("end-title");
  const endSummary = $("end-summary");
  const endScore = $("end-score");
  const endCorrect = $("end-correct");
  const endWrong = $("end-wrong");

  const btnPlayAgain = $("btn-play-again");
  const btnBackHome = $("btn-back-home");

  // Player info for home form
  let lastPlayerName = "-";
  let lastPlayerSchool = "-";

  const state = {

    score: 0,
    lives: 3,
    level: 1,
    idx: 0,
    correct: 0,
    wrong: 0,
    locked: false,
    currentSet: [],

    // timer per soal (detik)
    timePerQuestion: 5,
    timerLeft: 5,
    timerId: null,
    timerRunning: false,
  };


  const data = {
    1: {
      theme: "Campuran",
      speech: [
        "Yuk latihan Matematika & English! 📚✨",
        "Pilih jawaban yang paling tepat!",
      ],
      questions: [
        // --- MATEMATIKA (5) ---

        {
          q: "2 × 3 = ...",
          theme: "Matematika - Perkalian",
          choices: { A: "5", B: "6", C: "7" },
          answer: "B",
          explain: "2 × 3 = 6.",
        },

        {
          q: "4 × 5 = ...",
          theme: "Matematika - Perkalian",
          choices: { A: "18", B: "20", C: "25" },
          answer: "B",
          explain: "4 × 5 = 20.",
        },
        {
          q: "7 + 8 = ...",
          theme: "Matematika - Penjumlahan",
          choices: { A: "14", B: "15", C: "16" },
          answer: "B",
          explain: "7 + 8 = 15.",
        },
        {
          q: "9 + 6 = ...",
          theme: "Matematika - Penjumlahan",
          choices: { A: "13", B: "15", C: "20" },
          answer: "B",
          explain: "9 + 6 = 15.",
        },
        {
          q: "15 − 7 = ...",
          theme: "Matematika - Pengurangan",
          choices: { A: "6", B: "7", C: "8" },
          answer: "C",
          explain: "15 − 7 = 8.",
        },

        // --- BAHASA INGGRIS SD (5) ---
        {
          q: "Tebak: kucing = ...",
          theme: "English - Animals",
          media: { type: "animal", id: "cat" },
          choices: { A: "Cat", B: "Dog", C: "Bird" },
          answer: "A",
          explain: "Kucing = Cat.",
        },

        {
          q: "Tebak: apel = ...",
          theme: "English - Fruit",
          media: { type: "fruit", id: "apple" },
          choices: { A: "Apple", B: "Orange", C: "Grape" },
          answer: "A",
          explain: "Apel = Apple.",
        },

        {
          q: "Tebak: jeruk = ...",
          theme: "English - Fruit",
          media: { type: "fruit", id: "orange" },
          choices: { A: "Apple", B: "Orange", C: "Banana" },
          answer: "B",
          explain: "Jeruk = Orange.",
        },

        {
          q: "Tebak: anggur = ...",
          theme: "English - Fruit",
          media: { type: "fruit", id: "grape" },
          choices: { A: "Grape", B: "Gum", C: "Berry" },
          answer: "A",
          explain: "Anggur = Grape.",
        },

        {
          q: "Tebak: anjing = ...",
          theme: "English - Animals",
          media: { type: "animal", id: "dog" },
          choices: { A: "Cat", B: "Dog", C: "Fish" },
          answer: "B",
          explain: "Anjing = Dog.",
        },



      ],
    },
  };


  // ---------- helpers ----------
  function showScreen(name) {
    const next = screens[name];
    if (!next) return;

    // If changing screens, apply a quick morph-like transition.
    const current = Object.values(screens).find((el) => el && !el.hidden);
    if (current && current !== next) {
      current.classList.remove("is-in");
      current.classList.add("is-out");
      // hide after animation
      setTimeout(() => {
        current.hidden = true;
        current.classList.remove("is-out");
      }, 220);
    } else {
      // reset classes if no current
      Object.values(screens).forEach((el) => el?.classList.remove("is-out", "is-in"));
    }

    // show next
    next.hidden = false;
    next.classList.remove("is-out");
    // force reflow so transition runs consistently
    // eslint-disable-next-line no-unused-expressions
    next.offsetHeight;
    next.classList.add("is-in");

    // hide others (already handled by current transition, but keep it consistent)
    Object.values(screens).forEach((el) => {
      if (el && el !== next) el.hidden = true;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  function updateHUD() {
    scoreEl.textContent = String(state.score);
    livesEl.textContent = String(state.lives);
    levelEl.textContent = String(state.level);

    qIndexEl.textContent = String(state.idx + 1);
    qTotalEl.textContent = String(state.currentSet.length);

    const pct = state.currentSet.length
      ? ((state.idx / state.currentSet.length) * 100).toFixed(0)
      : 0;
    barFill.style.width = pct + "%";

    countCorrectEl.textContent = String(state.correct);
    countWrongEl.textContent = String(state.wrong);
  }

  function setTeacherSpeech(text) {
    teacherSpeech.textContent = text;
  }

  function lockAnswers(lock) {
    state.locked = lock;
    buttons.forEach((b) => {
      b.disabled = lock;
    });
    btnNext.disabled = true;
  }

  function setFeedback(text, kind) {
    feedback.textContent = text;
    feedback.style.color = kind === "good" ? "#16a34a" : kind === "bad" ? "#ef4444" : "#0b1224";
  }

  function formatChoiceText(obj) {
    ansA.textContent = obj.A;
    ansB.textContent = obj.B;
    ansC.textContent = obj.C;
  }

  function shuffleArray(arr) {
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickLevelQuestions(level) {
    const lv = data[level] || data[1];

    // clone so shuffle doesn't mutate original data
    state.currentSet = lv.questions.map((q) => ({ ...q, choices: { ...q.choices } }));

    // Shuffle jawaban (A/B/C) setiap game mulai ulang, tapi tetap menjaga answer yang benar
    state.currentSet.forEach((q) => {
      const letters = ["A", "B", "C"];
      shuffleArray(letters);

      const oldChoices = { ...q.choices };
      const oldAnswer = q.answer; // "A" | "B" | "C"

      // map pilihan lama -> posisi baru
      // misal: letters = ["B","A","C"] berarti nilai lama A pindah ke posisi letters[?]
      // Kita lakukan dengan cara: ambil nilai lama berdasarkan index & assign ke huruf baru.
      // oldChoices.A/B/C mengikuti urutan lettersNew yang diacak.
      const oldValues = [oldChoices.A, oldChoices.B, oldChoices.C];
      const newChoices = {};
      letters.forEach((newKey, i) => {
        newChoices[newKey] = oldValues[i];
      });

      // Hitung ulang answer: nilai yang benar lama adalah oldChoices[oldAnswer]
      const correctValue = oldChoices[oldAnswer];
      q.choices = newChoices;
      q.answer = letters.find((k) => newChoices[k] === correctValue);
    });
  }


  function stopTimer() {
    state.timerRunning = false;
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();

    state.timerRunning = true;
    state.timerLeft = state.timePerQuestion;
    timerText?.classList.remove("warn", "danger");
    timerText && (timerText.textContent = String(state.timerLeft));

    state.timerId = setInterval(() => {
      if (!state.timerRunning) return;
      state.timerLeft -= 1;
      if (timerText) {
        timerText.textContent = String(Math.max(0, state.timerLeft));
        timerText.classList.toggle("warn", state.timerLeft <= 2 && state.timerLeft > 0);
        timerText.classList.toggle("danger", state.timerLeft <= 1);
      }

      if (state.timerLeft <= 0) {
        // time out = wrong
        stopTimer();
        const q = state.currentSet[state.idx];

        lockAnswers(true);
        buttons.forEach((b) => b.classList.remove("correct", "wrong"));
        const correctKey = q.answer;
        buttons.forEach((b) => {
          if (b.getAttribute("data-key") === correctKey) {
            b.classList.add("correct");
          }
        });

        state.wrong += 1;
        state.lives -= 1;
        setFeedback("Waktu habis! " + (q.explain || ""), "bad");

        updateHUD();
        btnNext.disabled = false;
        btnNext.textContent = "Lanjut";

        if (state.lives <= 0) {
          endGame();
        }
      }
    }, 1000);
  }

  function renderQuestion() {
    const q = state.currentSet[state.idx];
    const lv = data[state.level] || data[1];

    questionTitle.textContent = q.q;
    tagTheme.textContent = "Tema: " + (q.theme || lv.theme);
    formatChoiceText(q.choices);

    // media for english questions (simple emoji stand-in)
    if (questionMedia) {
      if (q.media?.type === "animal") {
        const map = { cat: "🐱" };
        questionMedia.textContent = map[q.media.id] || "🐾";
        questionMedia.setAttribute("data-kind", "animal");
      } else if (q.media?.type === "fruit") {
        const map = { apple: "🍎", orange: "🍊", grape: "🍇" };
        questionMedia.textContent = map[q.media.id] || "🍓";
        questionMedia.setAttribute("data-kind", "fruit");
      } else {
        questionMedia.textContent = "";
        questionMedia.removeAttribute("data-kind");
      }
    }

    setTeacherSpeech(lv.speech[Math.min(lv.speech.length - 1, state.idx)]);

    feedback.textContent = "";
    feedback.style.color = "#0b1224";


    btnNext.disabled = true;
    lockAnswers(false);
    startTimer();
  }


  function endGame() {
    playSfx("gameover");

    // update home last score bar (even though we're on end screen)
    const finalScore = state.score;
    homeLastBar && homeLastBar.setAttribute("data-fill", "100%");
    homeLastText && (homeLastText.textContent = `Skor pemain sebelumnya: ${lastPlayerName} (${lastPlayerSchool}) - ${finalScore}`);

    showScreen("end");


    endScore.textContent = String(state.score);

    endCorrect.textContent = String(state.correct);
    endWrong.textContent = String(state.wrong);

    const maxScore = state.currentSet.length * 10;
    const ratio = maxScore ? state.score / maxScore : 0;

    let label = "Hebat!";
    if (ratio >= 0.8) label = "Mantap! Kamu juara! 🏆";
    else if (ratio >= 0.55) label = "Semangat terus! 🌟";
    else label = "Terus belajar ya! 💪";

    endTitle.textContent = label;
    endSummary.textContent = `Kamu menyelesaikan ${state.currentSet.length} soal. Terima kasih sudah belajar bersama Bu Guru!`;
  }

  function start(level = 1) {
    stopTimer();

    // read player info from home form
    const name = (playerName?.value || "").trim();
    const school = (playerSchool?.value || "").trim();
    lastPlayerName = name || "-";
    lastPlayerSchool = school || "-";

    homeLastBar?.style?.setProperty("--fill", "0%");
    homeLastText && (homeLastText.textContent = `Skor pemain sebelumnya: ${lastPlayerName} (${lastPlayerSchool}) - 0`);


    state.score = 0;

    state.lives = 3;
    state.level = level;
    state.idx = 0;
    state.correct = 0;
    state.wrong = 0;

    pickLevelQuestions(state.level);
    updateHUD();

    btnNext.disabled = true;
    lockAnswers(false);

    showScreen("game");
    renderQuestion();
  }


  function nextQuestion() {
    stopTimer();
    state.idx++;
    if (state.idx >= state.currentSet.length) {

      // simple: if level 1 finished and lives >0, offer level 2 automatically
      const nextLevel = state.level === 1 ? 2 : 1;
      // move to end game always per current task; keep it simple
      endGame();
      return;
    }
    updateHUD();
    renderQuestion();
  }

  function answerForKey(key) {
    const q = state.currentSet[state.idx];
    return q.answer === key;
  }

  // ---------- events ----------
  btnStart.addEventListener("click", () => {
    playSfx("start");
    btnHow.blur();
    start(1);
  });


  btnHow.addEventListener("click", () => {
    howBox.hidden = !howBox.hidden;
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.locked) return;

      const key = btn.getAttribute("data-key");
      const q = state.currentSet[state.idx];
      const isCorrect = q.answer === key;

      // mark selection
      lockAnswers(true);

      buttons.forEach((b) => {
        b.classList.remove("correct", "wrong");
        if (b.getAttribute("data-key") === key) {
          b.classList.add(isCorrect ? "correct" : "wrong");
        }
      });

      if (isCorrect) {
        playSfx("correct");
        state.correct += 1;
        state.score += 10;
        setFeedback("Benar! " + q.explain, "good");
      } else {
        playSfx("wrong");
        state.wrong += 1;
        // Nyawa berkurang saat salah
        state.lives -= 1;
        setFeedback("Wah, kurang tepat. " + q.explain, "bad");
      }




      updateHUD();
      btnNext.disabled = false;

      if (state.lives <= 0) {
        endGame();
      } else {
        btnNext.textContent = "Lanjut";
      }
    });
  });

  btnNext.addEventListener("click", () => {
    playSfx("next");
    // reset highlight
    buttons.forEach((b) => b.classList.remove("correct", "wrong"));
    btnNext.disabled = true;
    nextQuestion();
  });




  btnRestart?.addEventListener("click", () => {
    // Tetap restart game, tapi jika yang dimaksud adalah kembali ke halaman awal
    // maka gunakan tombol "Mulai Bermain" setelah restart.
    playSfx("start");
    start(1);
  });


  // Cek score di halaman terakhir -> langsung balik ke halaman awal
  const btnCheckScore = $("btn-check-score");
  btnCheckScore?.addEventListener("click", () => {
    playSfx("next");
    // pindah ke home agar papan score baru terlihat
    showScreen("home");
  });

  // Tombol Home (digunakan dari screen-game)
  const btnBackHomeInGame = $("btn-back-home");
  btnBackHomeInGame?.addEventListener("click", () => {
    playSfx("start");
    showScreen("home");
  });




  btnPlayAgain.addEventListener("click", () => {
    playSfx("start");
    start(1);
  });

  // Tombol "Kembali" di screen-end
  // (di index.html id="btn-back-home" sudah dipakai di screen-game dan screen-end,
  // jadi kita pasang sekali saja di elemen yang sama)
  // catatan: event listener untuk tombol "btn-back-home" di screen-game sudah ada di atas.






  // keyboard shortcuts for accessibility
  document.addEventListener("keydown", (e) => {
    if (screens.game.hidden) return;
    if (state.locked) return;

    if (e.key === "a" || e.key === "A") buttons.find((b) => b.dataset.key === "A")?.click();
    if (e.key === "b" || e.key === "B") buttons.find((b) => b.dataset.key === "B")?.click();
    if (e.key === "c" || e.key === "C") buttons.find((b) => b.dataset.key === "C")?.click();
    if (e.key === "Enter" && !btnNext.disabled) btnNext.click();
  });

  // initial screen
  showScreen("home");
})();

