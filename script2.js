const gameArea = document.getElementById('gameArea');
const player = document.querySelector('.player');
let playerSpeed = 20; // プレイヤーの移動速度
let playerBoost = 1; // プレイヤーのスピードブースト
let isShiftPressed = false; // Shiftキーが押されているかの状態

// プレイヤーの位置を初期化
let playerPosition = {
  x: gameArea.offsetWidth / 10 - player.offsetWidth / 2,
  y: gameArea.offsetHeight / 2 - player.offsetHeight / 2 // 修正：Y位置をプレイヤーの高さの半分で調整
};

// プレイヤーの位置を更新する関数
function updatePlayerPosition() {
  player.style.left = playerPosition.x + 'px'; 
  player.style.bottom = playerPosition.y + 'px';
}

// イベントリスナーを使用してキー入力に応じてプレイヤーを移動
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      playerPosition.x += playerSpeed * playerBoost;
      if (playerPosition.x > gameArea.offsetWidth - player.offsetWidth) {
        playerPosition.x = gameArea.offsetWidth - player.offsetWidth;
      }
      break;
    case 'ArrowLeft': // 左に移動
      playerPosition.x -= playerSpeed * playerBoost;
      if (playerPosition.x < 0) {
        playerPosition.x = 0;
      }
      break;
 case 'ArrowUp': // ジャンプ
      jump();
      break;
  
    case 'Enter': // 攻撃
      fireProjectile();
      break;
 }
 updatePlayerPosition();// 位置を更新
});




//------ジャンプ---------
let isJumping = false;

function jump() {
  if (isJumping) return; // すでにジャンプ中なら何もしない

  isJumping = true; // ジャンプ開始を設定
  let jumpHeight = 100;
  let originalY = playerPosition.y;

  let upInterval = setInterval(() => {
    if (jumpHeight <= playerPosition.y - originalY) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (playerPosition.y <= originalY) {
          clearInterval(downInterval);
          playerPosition.y = originalY;
          updatePlayerPosition();
          isJumping = false; // ジャンプ終了を設定
        } else {
          playerPosition.y -= 2;
          updatePlayerPosition();
        }
      }, 10);
    } else {
      playerPosition.y += 2;
      updatePlayerPosition();
    }
  }, 10);
}




function fireProjectile() {
  const projectile = document.createElement('div');
  projectile.classList.add('projectile');
  // 球の初期位置をプレイヤーの中心の右側に設定します。
  projectile.style.left = (playerPosition.x + player.offsetWidth ) + 'px';
  projectile.style.bottom = (playerPosition.y/4 + player.offsetHeight ) + 'px';
  gameArea.appendChild(projectile);

  // 球が右に移動するように設定
  let projectileLeft = parseInt(projectile.style.left, 10);
 let moveProjectile = setInterval(() => {
    projectileLeft += 20;
    projectile.style.left = projectileLeft + 'px';
    if (projectileLeft > gameArea.offsetWidth) {
      clearInterval(moveProjectile);
      projectile.remove();
    } else {
      projectileLeft += 20; // この数値で球の速度を調整します
      projectile.style.left = projectileLeft + 'px';
    }
  }, 20);
}


// ゲームエリア内での初期プレイヤーの位置を設定
updatePlayerPosition();

// 敵要素を作成
let enemy = document.createElement('div');
enemy.className = 'enemy';
// 敵要素を右端に配置
enemy.style.right = '0px';
// 敵要素をゲームエリアに追加
document.getElementById('gameArea').appendChild(enemy);


// 画像を持つ敵キャラクターを作成する
const enemyImage = document.createElement('img');
enemyImage.src = 'images/11.png'; // 画像ファイルのパスを適切に設定してください
enemyImage.style.width = '100%'; // 敵のdivにフィットするようにサイズを調整
enemy.appendChild(enemyImage);
gameArea.appendChild(enemy);

let enemyPosition = {
  x: gameArea.offsetWidth, // 画面の右端に敵が位置するように設定
  y: gameArea.offsetHeight  // 垂直位置は必要に応じて調整してください
};

function updateEnemyPosition() {
  enemy.style.left = enemyPosition.x + 'px';
  enemy.style.bottom = playerPosition.y + 'px';
}

enemyPosition.x = gameArea.offsetWidth - enemy.offsetWidth; // ゲームエリアの右端に敵を配置
updateEnemyPosition(); 

// 敵が跳ねる機能を改善
function enemyJump() {
  let jumpHeight = 50; // ジャンプの高さ
  let originalY = enemyPosition.y; // ジャンプ前の位置
  enemyPosition.y += jumpHeight; // ジャンプで上昇
  updateEnemyPosition(); // 位置更新
  
  // ジャンプからの着地
  setTimeout(() => {
    enemyPosition.y = originalY; // 元の位置に戻す
    updateEnemyPosition(); // 位置更新
    
    // 次のジャンプまでのランダムな時間を計算し、再帰的にジャンプ関数を呼び出す
    let nextJumpInterval = Math.random() * (20000 - 10000) + 10000; // 10-20秒
    setTimeout(enemyJump, nextJumpInterval);
  }, 500); // ジャンプの持続時間
}

// ゲーム開始時に最初のジャンプをスケジュールする
setTimeout(enemyJump, Math.random() * (20000 - 10000) + 10000); // 10-20秒で最初のジャンプを開始

// 敵がプレイヤーに近づく機能
function enemyAdvance() {
  let advanceAmount = Math.random() * 10; // 小さな値でスムーズな動きにする
  enemyPosition.x -= advanceAmount; // プレイヤーに向かって左に移動
  if (enemyPosition.x < 0) {
    enemyPosition.x = gameArea.offsetWidth - enemy.offsetWidth; // ゲームエリアの右端にリセット
  }
  enemy.style.left = enemyPosition.x + 'px';
}

// 敵の行動をランダムなタイミングで制御する
function controlEnemyActions() {


  // プレイヤーに近づく
  setInterval(enemyAdvance, 1000);
}

// 初期位置の更新
updateEnemyPosition();

// 敵の行動を開始
controlEnemyActions();

function enemyFireProjectile(enemy) {
  // 火の玉を生成し、クラスを付与
  const enemyProjectile = document.createElement('div');
    enemyProjectile.classList.add('enemyProjectile');
  
// img要素を作成
const image = document.createElement('img');

// img要素のsrc属性を設定（画像のURLを'your-image-path.jpg'に置き換えてください）
image.src = 'images/4.png';

// img要素をenemyProjectile divに追加
enemyProjectile.appendChild(image);

// enemyProjectile divをDOMに追加（例えばbodyに追加）
document.body.appendChild(enemyProjectile);
  

  // 敵の中心から火の玉の位置を設定
    
  const enemyRect = enemy.getBoundingClientRect(); // 敵の現在の位置とサイズを取得
  enemyProjectile.style.left = (enemyRect.left + enemy.offsetWidth ) + 'px';
  enemyProjectile.style.bottom = (gameArea.offsetHeight - enemyRect.top) + 'px';
  gameArea.appendChild(enemyProjectile);

  // 火の玉の移動定義
  let projectileLeft = parseFloat(enemyProjectile.style.left);
  
  // 移動間隔を設定する
  let moveProjectile = setInterval(() => {
    projectileLeft -= 20; // 火の玉の左への移動速度を設定
    enemyProjectile.style.left = projectileLeft + 'px';

    // 火の玉がゲームエリアの左側に到達したか、または敵が倒された場合に削除
    if (projectileLeft < 0 || enemy.isDefeated) {
      clearInterval(moveProjectile);
      enemyProjectile.remove();
    }
  }, 30);
}



// 敵の行動を制御する
function controlEnemyActions(enemy)  {
  // より速いタイミングで跳ねる
  setInterval(enemyJump, Math.random() * 1500 + 500);

  // より速いタイミングで近づく
  setInterval(enemyAdvance, Math.random() * 1500 + 500);

  // より速いタイミングで火の玉を発射
  setInterval(enemyFireProjectile, Math.random() * 1500 + 1000);
}

 setInterval(() => {
    enemyFireProjectile(enemy);
 }, Math.random() * 1500 + 1000);


// 敵の行動を開始
controlEnemyActions();



// アイテムを生成して画面に表示する関数
function createItem() {
  var gameArea = document.getElementById('gameArea');
  var item = document.createElement('div');
  item.className = 'item';
  // アイテムをゲームエリアのランダムな位置に配置
  item.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
  gameArea.appendChild(item);

  // アイテムを下に落とす動作
  function dropItem() {
    var itemPos = item.offsetTop;
    item.style.top = itemPos + 5 + 'px';
    // アイテムが床に到達したら停止
    if (itemPos < gameArea.offsetHeight - 30) {
      requestAnimationFrame(dropItem);
    } else {
      item.remove();
    }
  }

  // アイテムの落下を開始
  dropItem();
}

// アイテムを定期的に生成
setInterval(createItem, 5000); // 2秒ごとにアイテムを生成




//------

const playerHealthBar = document.getElementById('playerHealthBar'); // HTMLにプレイヤーのHPバーがあると仮定
const enemyHealthBar = document.getElementById('enemyHealthBar'); // HTMLに敵のHPバーがあると仮定

let enemyHealth = 100; // 敵の健康状態も追加
let playerHealth = 100; 

function updateHealthBars() {
    const playerHpBar = document.getElementById('player-hp');
    const enemyHpBar = document.getElementById('enemy-hp');

    // 敵のHPバーの幅を現在のHPに応じて更新
    enemyHpBar.style.width = enemyHealth + '%';
    
    // プレイヤーのHPバーを更新
    // 幅を動的に変更
    playerHpBar.style.width = playerHealth + '%';
    // 右端を固定
    playerHpBar.style.right = '0';
    // 左端を動的に変更するには、100%から現在のHPを引く
    playerHpBar.style.left = (100 - playerHealth) + '%';
}

function applyDamageToPlayer(damage) {
    playerHealth -= damage;
    if (playerHealth <= 0) {
        playerHealth = 0;
        showGameOverModal('山内さん'); // 敵が勝ったとき
        // ゲームの更新ループを停止するなどの処理をここに追加することができます
    }
    updateHealthBars();
}

function applyDamageToEnemy(damage) {
    enemyHealth -= damage;
    if (enemyHealth <= 0) {
        enemyHealth = 0;
        showGameOverModal('あなた'); // プレイヤーが勝ったとき
        // ゲームの更新ループを停止するなどの処理をここに追加することができます
    }
    updateHealthBars();
}




// プレイヤーと敵のプロジェクタイルの衝突検出
function checkCollisionWithPlayer(projectile) {
  const playerRect = player.getBoundingClientRect();
  const projectileRect = projectile.getBoundingClientRect();

  if (
    projectileRect.left < playerRect.right &&
    projectileRect.right > playerRect.left &&
    projectileRect.top < playerRect.bottom &&
    projectileRect.bottom > playerRect.top
  ) {
    // 衝突が発生した場合はHPを減少させる
    applyDamageToPlayer(10);
    projectile.remove(); // 衝突したプロジェクタイルを削除
    return true; // 衝突が発生したことを示す
  }

  return false; // 衝突が発生していないことを示す
}

// アイテムとプレイヤーの衝突検出関数
function checkCollisionWithItem(item) {
  const playerRect = player.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (
    itemRect.left < playerRect.right &&
    itemRect.right > playerRect.left &&
    itemRect.top < playerRect.bottom &&
    itemRect.bottom > playerRect.top
  ) {
    return true; // 衝突が発生したことを示す
  }
  return false; // 衝突が発生していないことを示す
}

// アイテムを生成して画面に表示する関数の更新
function createItem() {
  var gameArea = document.getElementById('gameArea');
  var item = document.createElement('div');
  item.className = 'item';
  // アイテムをゲームエリアのランダムな位置に配置
  item.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
  gameArea.appendChild(item);

  // アイテムを下に落とす動作
function dropItem() {
  var itemPos = item.offsetTop;
  item.style.top = itemPos + 5 + 'px';

  // アイテムが床に到達したら停止
  if (itemPos < gameArea.offsetHeight - 30) {
    requestAnimationFrame(dropItem); // ここで再帰的に呼び出す
    // 衝突検出処理を追加
    if (checkCollisionWithItem(item)) {
      // 衝突が発生した場合はアイテムを削除し、プレイヤーのHPを回復する
      item.remove();
      playerHealth = Math.min(playerHealth + 10, 100); // HPが最大値を超えないようにする
      updateHealthBars(); // HPバーを更新
    }
  } else {
    item.remove();
  }
}
  // アイテムの落下を開始
  dropItem();
}


// 敵とプレイヤーのプロジェクタイルの衝突検出
function checkCollisionWithEnemy(projectile) {
  const enemyRect = enemy.getBoundingClientRect();
  const projectileRect = projectile.getBoundingClientRect();

  if (
    projectileRect.left < enemyRect.right &&
    projectileRect.right > enemyRect.left &&
    projectileRect.top < enemyRect.bottom &&
    projectileRect.bottom > enemyRect.top
  ) {
    // 衝突が発生した場合はHPを減少させる
    applyDamageToEnemy(10);
    projectile.remove(); // 衝突したプロジェクタイルを削除
    return true; // 衝突が発生したことを示す
  }

  return false; // 衝突が発生していないことを示す
}

// プロジェクタイルの移動処理で衝突検出を呼び出す
let moveProjectile = setInterval(() => {
  projectileLeft += 20;
  projectile.style.left = projectileLeft + 'px';
  // 敵との衝突検出を呼び出し
  if (checkCollisionWithEnemy(projectile)) {
    clearInterval(moveProjectile); // プロジェクタイルの移動を止める
  }
  if (projectileLeft > gameArea.offsetWidth) {
    clearInterval(moveProjectile);
    projectile.remove();
  }
}, 20);

// 敵のプロジェクタイルの移動処理で衝突検出を呼び出す
let moveEnemyProjectile = setInterval(() => {
  projectileLeft -= 50;
  enemyProjectile.style.left = projectileLeft + 'px';
  // プレイヤーとの衝突検出を呼び出し
  if (checkCollisionWithPlayer(enemyProjectile)) {
    clearInterval(moveEnemyProjectile); // プロジェクタイルの移動を止める
  }
  if (projectileLeft < 0) {
    clearInterval(moveEnemyProjectile);
    enemyProjectile.remove();
  }
}, 30);



// 衝突検出関数
function detectCollisions() {
  // プレイヤーのプロジェクタイルと敵との衝突
  const projectiles = document.querySelectorAll('.projectile');
  const enemyRect = enemy.getBoundingClientRect();

  projectiles.forEach(projectile => {
    const projectileRect = projectile.getBoundingClientRect();

    if (projectileRect.right > enemyRect.left &&
        projectileRect.left < enemyRect.right &&
        projectileRect.bottom > enemyRect.top &&
        projectileRect.top < enemyRect.bottom) {
      // 衝突が起きたら
      projectile.remove(); // プロジェクタイルを削除
      applyDamageToEnemy(10); // ダメージ関数を呼び出し、適当な数値をダメージとして与える
    }
  });

  // 敵のプロジェクタイルとプレイヤーとの衝突
  const enemyProjectiles = document.querySelectorAll('.enemyProjectile');
  const playerRect = player.getBoundingClientRect();

  enemyProjectiles.forEach(projectile => {
    const projectileRect = projectile.getBoundingClientRect();

    if (projectileRect.left < playerRect.right &&
        projectileRect.right > playerRect.left &&
        projectileRect.bottom > playerRect.top &&
        projectileRect.top < playerRect.bottom) {
      // 衝突が起きたら
      projectile.remove(); // プロジェクタイルを削除
      applyDamageToPlayer(10); // ダメージ関数を呼び出し、適当な数値をダメージとして与える
    }
  });

  // 敵とプレイヤーとの衝突
  if (playerRect.right > enemyRect.left &&
      playerRect.left < enemyRect.right &&
      playerRect.bottom > enemyRect.top &&
      playerRect.top < enemyRect.bottom) {
    // 衝突が起きたら
    applyDamageToPlayer(5); // プレイヤーにダメージ
    applyDamageToEnemy(5); // 敵にもダメージ
  }
}

// ゲームの更新ループ
function gameLoop() {
  // その他のゲームロジック...
  
  detectCollisions(); // 衝突検出関数を呼び出し

  // ゲームの描画や状態の更新...
}

// ゲームループを開始する
setInterval(gameLoop, 1000 / 60); // 約60FPSでゲームループを実行

function showGameOverModal(winner) {
    const gameOverModal = document.getElementById('gameOverModal'); // HTMLで定義されていることが前提
    const gameOverMessage = document.getElementById('gameOverMessage'); // HTMLで定義されていることが前提

    gameOverMessage.textContent = winner + ' が勝ちました！';
    gameOverModal.style.display = 'block'; // モーダルを表示
}

function restartGame() {
    // ゲームの状態をリセットする
    playerHealth = 100;
    enemyHealth = 100;
    
    // ゲームオーバーモーダルを非表示にする
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
    
    // ゲームループをリセットするために、既存のインターバルをクリアする
    clearInterval(gameInterval);
    
    // ゲームループを再開する
    gameInterval = setInterval(gameLoop, 1000 / 60);
    
    // HPバーを更新する
    updateHealthBars();
    
    // その他のゲーム要素をリセットする必要がある場合は、ここで行う
    // 例: プロジェクタイルをクリア、スコアをリセットなど
}

// ゲームループのインターバルを格納する変数
let gameInterval = setInterval(gameLoop, 1000 / 60);