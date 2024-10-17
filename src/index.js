import { TemplateExample } from 'game/TemplateExample.js';

window.addEventListener('load', () => {
	// new TemplateExample().start();
	var game = new TemplateExample()
	game.render();
	waitForClick(game)
});

function waitForClick(game) {
	game.start();
	// while (!game.gameOver) {
	// 	game.gameOver = game.scene.checkGameOver();
	// }
	// alert("GAME OVER")
	// window.addEventListener('click', () => {
	// 	game.start();
	// });
}
