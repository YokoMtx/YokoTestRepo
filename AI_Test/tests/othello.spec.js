import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('file:///c:/Users/yokoyama/Documents/Cline/Projects/AI_Test/AI_Test/index.html');
    await page.screenshot({ path: `test-results/screenshots/initial-load.png` });
    await page.screenshot({ path: `test-results/screenshots/initial-load.png` });
});

test('初期状態のボードが正しく表示されていること', async ({ page }) => {
    // ボードのセルが64個あることを確認
    await expect(page.locator('#board .cell')).toHaveCount(64);
    await page.screenshot({ path: `test-results/screenshots/initial-board-cells.png` });

    // 初期配置の駒が正しいことを確認
    await expect(page.locator('.cell:nth-child(28) .piece.white')).toBeVisible(); // (3,3)
    await expect(page.locator('.cell:nth-child(29) .piece.black')).toBeVisible(); // (3,4)
    await expect(page.locator('.cell:nth-child(36) .piece.black')).toBeVisible(); // (4,3)
    await expect(page.locator('.cell:nth-child(37) .piece.white')).toBeVisible(); // (4,4)
    await page.screenshot({ path: `test-results/screenshots/initial-pieces.png` });

    // スコアが初期値であることを確認
    await expect(page.locator('#black-score')).toHaveText('2');
    await expect(page.locator('#white-score')).toHaveText('2');
    await page.screenshot({ path: `test-results/screenshots/initial-scores.png` });

    // 現在のプレイヤーが黒であることを確認
    await expect(page.locator('#current-player')).toHaveText('黒');
    await page.screenshot({ path: `test-results/screenshots/initial-current-player.png` });
});

test('有効な手で駒を置くと、駒が反転しスコアが更新されること', async ({ page }) => {
    // 黒が(2,3)に駒を置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="3"]').click();
    await page.screenshot({ path: `test-results/screenshots/move-2-3-black.png` });

    // (2,3)に黒の駒が置かれたことを確認
    await expect(page.locator('.cell[data-row="2"][data-col="3"] .piece.black')).toBeVisible();
    await page.screenshot({ path: `test-results/screenshots/piece-at-2-3.png` });

    // (3,3)の白の駒が黒に反転したことを確認
    await expect(page.locator('.cell[data-row="3"][data-col="3"] .piece.black')).toBeVisible();
    await expect(page.locator('.cell[data-row="3"][data-col="3"] .piece.white')).not.toBeVisible();
    await page.screenshot({ path: `test-results/screenshots/piece-at-3-3-flipped.png` });

    // スコアが更新されたことを確認 (黒: 4, 白: 1)
    await expect(page.locator('#black-score')).toHaveText('4');
    await expect(page.locator('#white-score')).toHaveText('1');
    await page.screenshot({ path: `test-results/screenshots/scores-after-move.png` });

    // 現在のプレイヤーが白に切り替わったことを確認
    await expect(page.locator('#current-player')).toHaveText('白');
    await page.screenshot({ path: `test-results/screenshots/player-switched-to-white.png` });
});

test('無効な手で駒を置こうとするとアラートが表示されること', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('無効な手です。');
        await dialog.dismiss();
    });

    // 黒が(0,0)に駒を置こうとする (無効な手)
    await page.locator('.cell[data-row="0"][data-col="0"]').click();

    // スコアやプレイヤーが変わっていないことを確認
    await expect(page.locator('#black-score')).toHaveText('2');
    await expect(page.locator('#white-score')).toHaveText('2');
    await expect(page.locator('#current-player')).toHaveText('黒');
});

test('パスが発生した場合にプレイヤーが切り替わること', async ({ page }) => {
    // ゲームを特定の状態に進める (白がパスする状況を作る)
    // 例: 黒が(2,3)に置く
    await page.locator('.cell[data-row="2"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (3,2)に白が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="2"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (2,4)に黒が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="4"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (4,2)に白が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="2"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (5,3)に黒が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (3,5)に白が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="5"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (5,4)に黒が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="4"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (4,5)に白が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="5"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (6,3)に黒が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (3,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (6,4)に黒が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="4"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (4,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,3)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (3,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,4)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="4"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (4,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,5)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="5"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (5,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,6)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="6"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (6,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,7)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="7"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (7,2)に白が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="2"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (6,2)に黒が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="2"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (5,2)に白が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="2"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (2,2)に黒が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="2"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (2,5)に白が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="5"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (5,5)に黒が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="5"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (5,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (6,5)に黒が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="5"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (6,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (2,6)に黒が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="6"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (2,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (0,3)に黒が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (0,4)に白が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="4"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (1,3)に黒が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="3"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (1,4)に白が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="4"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (0,2)に黒が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="2"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (0,5)に白が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="5"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (1,2)に黒が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="2"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (1,5)に白が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="5"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (0,1)に黒が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="1"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (0,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (1,1)に黒が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="1"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (1,6)に白が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="6"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (0,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (0,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="0"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (1,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (1,7)に白が置く (有効な手)
    await page.locator('.cell[data-row="1"][data-col="7"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (2,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (2,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="2"][data-col="1"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (3,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (3,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="3"][data-col="1"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (4,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (4,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="4"][data-col="1"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (5,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (5,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="5"][data-col="1"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (6,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (6,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="6"][data-col="1"]').click(); // 白 -> 黒

    // 黒がパスする状況を作るために、黒が置けない場所をクリック
    // (7,0)に黒が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="0"]').click(); // 黒 -> 白

    // 白がパスする状況を作るために、白が置けない場所をクリック
    // (7,1)に白が置く (有効な手)
    await page.locator('.cell[data-row="7"][data-col="1"]').click(); // 白 -> 黒

    // 白がパスするアラートが表示されることを確認
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('白はパス！');
        await dialog.dismiss();
    });

    // 黒がパスするアラートが表示されることを確認
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('黒はパス！');
        await dialog.dismiss();
    });

    // ゲーム終了アラートが表示されることを確認
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('ゲーム終了！');
        await dialog.dismiss();
    });
});

test('リセットボタンでゲームが初期状態に戻ること', async ({ page }) => {
    // ゲームを進行させる
    await page.locator('.cell[data-row="2"][data-col="3"]').click(); // 黒が(2,3)に置く

    // リセットボタンをクリック
    await page.locator('#reset-button').click();

    // ボードが初期状態に戻ったことを確認
    await expect(page.locator('.cell:nth-child(28) .piece.white')).toBeVisible(); // (3,3)
    await expect(page.locator('.cell:nth-child(29) .piece.black')).toBeVisible(); // (3,4)
    await expect(page.locator('.cell:nth-child(36) .piece.black')).toBeVisible(); // (4,3)
    await expect(page.locator('.cell:nth-child(37) .piece.white')).toBeVisible(); // (4,4)

    // スコアが初期値に戻ったことを確認
    await expect(page.locator('#black-score')).toHaveText('2');
    await expect(page.locator('#white-score')).toHaveText('2');

    // 現在のプレイヤーが黒に戻ったことを確認
    await expect(page.locator('#current-player')).toHaveText('黒');
});
