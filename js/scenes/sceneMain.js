class SceneMain extends Phaser.Scene{
    constructor(){
        super('SceneMain');
    }

    preload(){
        this.load.spritesheet("blocks", "img/blocks.png", {frameWidth: 64, frameHeight: 84});

        this.load.image("btnPlayAgain", 'img/btnPlayAgain.png');
    }
    create(){
        this.blockGroup = this.add.group();

        this.clickLock = false;
        this.colorArray = [];
        this.centerBlock = null;

        for(var i = 0; i < 25; i++){
            var color = Phaser.Math.Between(0, model.numberOfColors);
            this.colorArray.push(color);
        }

        var xx = 0;
        var yy= 0;
        var k = 0;


        for (var i = 0; i < 5; i++){
            for (var j = 0; j < 5; j++){
                var block = this.add.image(0, 0, "blocks");
                this.blockGroup.add(block);

                block.displayWidth = game.config.width/5;
                block.displayHeight = game.config.height/5;
                block.setFrame(this.colorArray[k]);
                //block.setOrigin(0, 0);
                block.x = xx + block.displayWidth/2;
                block.y = yy + block.displayHeight/2;
                if(i == 2 && j==2 ){
                    this.centerBlock = block;
                }
                else{
                    block.setInteractive();
                }
                xx+=block.displayWidth;
                k++;
            }
            xx = 0;
            yy+=block.displayHeight;
        }

        this.colorArray[12] = -1;
        this.pickColor();

        this.input.on("gameobjectdown", this.selectBlock, this);

        this.timer = new CircleTimer({scene: this});
        this.timer.x = this.centerBlock.x;
        this.timer.y = this.centerBlock.y;

        this.timer.setCallback(this.timeUp, this);
        this.timer.start();

    }

    timeUp(){
        alert('time is up!');
    }

    selectBlock(pointer,block){
        if(this.clickLock == true)
        {
            console.log('Locked!');
            return;
        }
        if(block.frame.name == this.centerBlock.frame.name){
            block.removeInteractive();
            this.fall(block);
            this.pickColor();
        }
        else{
            this.doGameOver();
            return;
        }
        this.timer.reset();
    }

    pickColor(){
        if(this.colorArray.length == 0){
            console.log('next level');
            model.numberOfColors++;
            if(model.numberOfColors>7){
                model.numberOfColors = 7;
            }
            this.scene.restart();
            return;
        }
        var color = this.colorArray.shift();
        //color = 5;
        if(color == -1){
            this.pickColor();
            return;
        }
        this.centerBlock.setFrame(color);
    }

    fall(block){
        this.tweens.add({targets: block, duration: 1000, scaleX:0, scaleY:0});
    }

    doGameOver(){
        this.clickLock = true;
        this.timer.stop();
        this.blockGroup.children.iterate(function(child){
            this.fall(child);
        }.bind(this));
        this.time.addEvent({ delay: 1200, callback: this.doGameOver2, callbackScope: this, loop: false });
    }

    doGameOver2(){
        this.scene.start("SceneOver");
    }
    
    update(){
        
        
    }
}