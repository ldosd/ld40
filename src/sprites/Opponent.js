import Phaser from 'phaser'
import Util from '../util/util';
import config from '../config';

export default class extends Phaser.Sprite {
  constructor(game, x, y, asset, path, powerUpCollisionGroup, map, angle) {
    super(game, x, y, asset);
    this.scale.setTo(2);
    this.anchor.setTo(0.5);
    this.pathIndex = 0;
    this.offRoad = 0;
    this.boost = 0;
    this.map = map;
    this.path = path;
    this.game = game;
    this.game.physics.p2.enable(this, false);
    this.game.add.existing(this);
    this.body.collides(powerUpCollisionGroup, this.onPowerUp, this.game);
    this.body.angle = angle;
    this.velocity = 0;
    this.speed = this.game.rnd.integerInRange(1100, 1400);
    this.offset = this.game.rnd.integerInRange(50, 250);
    this.util = new Util();

    this.lap = 1;
    this.currentCheckpoint = 0;
    this.smoothed = false;
  }

  update() {

    if (!this.game.started) {
      return;
    }

    let pathPoint = this.path.get(this.pathIndex);
    this.accelerateTo(pathPoint, this.speed);
    this.environmentCheck();
    this.checkPath(pathPoint);

    if (this.map.isPointOnCheckpoint(this.x, this.y, this.currentCheckpoint)) {
      if ((this.currentCheckpoint >= this.map.polygons[this.map.POLYTYPE.checkpoints].length - 1)) {
        this.lap++;
        this.currentCheckpoint = 0;
      } else {
        this.currentCheckpoint++;
      }
      if (this.lap == config.totalLaps) {
        // OPPONENT WINS
        this.map.state.player.engineSound.stop(); // ....... don't ask
        this.game.state.start('GameOver', true, false, this.map.levelNumber);
      }
    }
  }

  accelerateTo(target, speed) {
    this.body.damping = 0.94;
    this.body.setZeroRotation();
    this.body.thrust(speed + this.boost - this.offRoad);

    let deltaAngle = this.game.math.angleBetween(this.x, this.y, target.x + this.offset, target.y + this.offset);
    deltaAngle += 1.57;

    let rotation = this.game.math.rotateToAngle(this.body.rotation, deltaAngle);
    this.body.rotation = rotation;
  }

  onPowerUp(powerUp) {
    if (powerUp.type) {

    }
  }

  checkPath(pathPoint) {
    let collision = this.AABB(this, pathPoint);

    if (collision) {
      this.pathIndex++;

      if (this.pathIndex >= this.path.pathPoints.length) {
        this.pathIndex = 0;
      }
    }
  }

  AABB(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y) {
      return true;
    }

    return false;
  }

  environmentCheck() {
    if (!this.map.isPointOnRoad(this.x, this.y)) {
      this.offRoad = 200;
    } else {
      this.offRoad = 0;
    }

    if (this.map.isPointOnBooster(this.x, this.y)) {
      this.boost = 1000;
    } else {
      this.boost = 0;
    }
  }
}
