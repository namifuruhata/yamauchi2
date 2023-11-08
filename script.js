const gameContainer = document.getElementById('game-container');
const imagePaths = ['images/1.png', 'images/2.png', 'images/3.png']; // 画像パスを修正
const fallingSpeed = 5;
const spawnRate = 1000;
const modal = document.getElementById("questionModal");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const questionTextElement = document.getElementById('questionText');
const questionsArray = [
  { question: 'JavaScriptはWebサイトに動的な要素を追加するために使用されるプログラミング言語です。', correctAnswer: 'はい' },
  { question: 'JavaScriptはブラウザのみで実行され、サーバーサイドでは使用できません。', correctAnswer: 'いいえ' },
    { question: '"use strict"はJavaScriptコードを厳格モードで実行するための宣言です。', correctAnswer: 'はい' },
    { question: 'JavaScriptはJavaと同じプログラミング言語の一種です。', correctAnswer: 'いいえ' },
    { question: 'JavaScriptで関数内部からその関数自身を参照するためには、arguments.calleeを使用できます。', correctAnswer: 'はい' },
    { question: 'クライアントサイドJavaScriptとサーバーサイドJavaScriptの両方でwindowオブジェクトがグローバルオブジェクトとして利用できます。', correctAnswer: 'いいえ' },
    { question: 'ECMAScriptはJavaScriptの標準仕様の名前です。', correctAnswer: 'はい' },
    { question: 'NaNは"Not-A-Number"の略であり、JavaScriptではNaN同士を比較した場合、結果は常にtrueになります。', correctAnswer: 'いいえ' },
    { question: 'JavaScriptにおいて、nullとundefinedは基本的に同じものを指しています。', correctAnswer: 'いいえ' },
    { question: 'document.querySelector()は、与えられたCSSセレクタに一致する文書内の最初のElementを返すJavaScriptメソッドです。', correctAnswer: 'はい' }
 
];

//トースト
function showToast(message) {
     console.log('showToast called with message:', message); 
  const toastContainer = document.getElementById('toast-container');
  const toastMessage = document.createElement('div');
  toastMessage.classList.add('toast-message');
  toastMessage.textContent = message;

  toastContainer.appendChild(toastMessage);
  toastMessage.style.display = 'block';

  // 3秒後にトーストを消去
  setTimeout(() => {
    toastContainer.removeChild(toastMessage);
  }, 1000);
}

// 得点を管理する変数
let score = 0;

// 問題が表示されているかのフラグ
let isQuestionActive = false;

// 現在表示中の質問オブジェクト
let currentQuestion = {};

function presentQuestion(callback) {
  // ランダムな質問を選ぶ
  const randomIndex = Math.floor(Math.random() * questionsArray.length);
  currentQuestion = questionsArray[randomIndex];
  questionTextElement.textContent = currentQuestion.question;

  // モーダルを表示
  modal.style.display = "block";
  isQuestionActive = true; // 問題がアクティブであることをフラグに設定
}

// 得点更新関数の更新（正解・不正解でスコアを増減）
function updateScore(isCorrect) {
  score += isCorrect ? 10 : -10; // 正解なら10点加算、不正解なら10点減算
  document.getElementById('score').textContent = `HP: ${score}`;
}

// 現在の落下している画像のリファレンスを保持する配列
let fallingImages = [];

// クリックされた画像のリファレンスを保持する変数
let clickedImage = null;


 function updateScoreAndShowToast(isCorrect) {
  // スコアを更新する
  updateScore(isCorrect);
  // トースト通知のメッセージ
  const message = isCorrect ? "正解です！HP+10" : "不正解です！HP-10";
  // トースト通知を表示
  showToast(message);
 }


function spawnImage() {
  // 画像要素を作成
  const image = document.createElement('img');
  const imagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
  image.src = imagePath;
  image.classList.add('falling-object');
  
 // 画像をクリックしたときのイベントリスナー
  image.onclick = function(event) {
    event.stopPropagation();
    clickedImage = image; // クリックされた画像を保持

    // 問題がアクティブでないときのみ実行
    if (!isQuestionActive) {
        if (gameContainer.contains(clickedImage)) {
            gameContainer.removeChild(clickedImage);
        }
        presentQuestion(function(isCorrect) {
            updateScoreAndShowToast(isCorrect);
        });
    }
};
    

  // 画像の位置を設定
  const startX = Math.random() * (gameContainer.offsetWidth - image.width);
  image.style.left = `${startX}px`;
  image.style.top = `0px`;

   gameContainer.appendChild(image);
  fallingImages.push(image); // 落下中の画像を配列に追加

  // 画像を落下させる関数
  fall(image);
}
function fall(image) {
  function continueFalling() {
    if (!isQuestionActive) { // もし質問がアクティブでなければ、落下を再開
      fall(image);
    } else {
      // もし質問がアクティブなら、次の落下を待機
      setTimeout(continueFalling, 100); // 100ミリ秒後に再チェック
    }
  }

  let currentTop = parseInt(image.style.top, 10);
  currentTop += fallingSpeed;
  image.style.top = `${currentTop}px`;

  if (currentTop < gameContainer.offsetHeight) {
    // 画像がまだゲームコンテナ内にある場合は、次のアニメーションフレームでfall関数を再帰的に呼び出す
    requestAnimationFrame(continueFalling);
  } else {
    // 画像がコンテナを超えた場合
    if (gameContainer.contains(image)) {
      gameContainer.removeChild(image);
      // スコアを減点し、トーストで通知する
      updateScore(false); // スコアを-10する
      showToast("山内が逃げました！ HP-10"); // 画像が逃げたことを通知
    }
    fallingImages = fallingImages.filter(img => img !== image); // 配列から画像を削除
  }
}


// btnYesとbtnNoのイベントハンドラー内を更新
btnYes.onclick = function () {
  modal.style.display = "none";
  isQuestionActive = false;

  if (gameContainer.contains(clickedImage)) {
      gameContainer.removeChild(clickedImage);
      fallingImages = fallingImages.filter(img => img !== clickedImage);
  }
  
  clickedImage = null; // 参照をクリア

  const isCorrect = currentQuestion.correctAnswer === 'はい';
  updateScoreAndShowToast(isCorrect); // この関数を呼び出す
}

btnNo.onclick = function () {
  modal.style.display = "none";
  isQuestionActive = false;

  if (gameContainer.contains(clickedImage)) {
      gameContainer.removeChild(clickedImage);
      fallingImages = fallingImages.filter(img => img !== clickedImage);
  }

  clickedImage = null; // 参照をクリア
  const isCorrect = currentQuestion.correctAnswer === 'いいえ';
  updateScoreAndShowToast(isCorrect); // この関数を呼び出す
}
// 新しい画像を定期的に生成
setInterval(spawnImage, spawnRate);

// ゲームオーバーとゲームクリアモーダルの参照を取得
const gameOverModal = document.getElementById('gameOverModal');
const gameClearModal = document.getElementById('gameClearModal');

// モーダル内のボタンの参照を取得
const restartButton = document.getElementById('restartButton');
const toTitleButton = document.getElementById('toTitleButton');
const restartButtonClear = document.getElementById('restartButtonClear');
const toTitleButtonClear = document.getElementById('toTitleButtonClear');

// ゲームをリスタートする関数
function restartGame() {
  score = 0; // スコアをリセット
  document.getElementById('score').textContent = `HP: ${score}`; // スコア表示を更新
  // ここでゲームをリセットする他の処理を実行します（必要に応じて）
  closeModal(); // モーダルを閉じる
}

// タイトル画面に戻る関数
function toTitle() {
  // タイトル画面への移動処理を実行します（実際のURLに置き換えてください）
  window.location.href = 'index.html';
}

// モーダルを閉じる汎用関数
function closeModal() {
  gameOverModal.style.display = 'none';
  gameClearModal.style.display = 'none';
}

// スコアが変わるたびに呼ばれる関数内でゲームオーバーとゲームクリアのチェックを追加
function updateScore(isCorrect) {
  score += isCorrect ? 10 : -10;
  document.getElementById('score').textContent = `HP: ${score}`;
  // スコアが -100 になったらゲームオーバーモーダルを表示
  if (score <= -100) {
    gameOverModal.style.display = 'block';
  }
  // スコアが +100 になったらゲームクリアモーダルを表示
  if (score >= 100) {
    gameClearModal.style.display = 'block';
  }
}

// ボタンのイベントリスナーを設定
restartButton.onclick = restartGame;
//toTitleButton.onclick = toTitle;
restartButtonClear.onclick = restartGame;
toTitleButtonClear.onclick = toTitle;