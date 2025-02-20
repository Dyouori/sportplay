<template>
    <div class="s-canvas">
      <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"/>
    </div>
  </template>
  <script>
    export default{
      name: 'identify-code',
      //接受父组件的传值
      props: {
        //展示的图片验证码
        identifyCode: {
          type: String,
          default: '1234'
        },
        //字体大小，最小值
        fontSizeMin: {
          type: Number,
          default: 16
        },
        //字体大小，最大值
        fontSizeMax: {
          type: Number,
          default: 40
        },
        //背景颜色色值最小值，最小为
        backgroundColorMin: {
          type: Number,
          default: 180
        },
        //背景颜色色值最大值，最大为255
        backgroundColorMax: {
          type: Number,
          default: 240
        },
        //字体颜色色值最小值，最小为0
        colorMin: {
          type: Number,
          default: 50
        },
        //字体颜色色值最大值，最大为255
        colorMax: {
          type: Number,
          default: 160
        },
        //干扰线颜色色值最小值，最小为0
        lineColorMin: {
          type: Number,
          default: 40
        },
        //干扰线颜色色值最大值，最大为255
        lineColorMax: {
          type: Number,
          default: 180
        },
        //干扰点颜色色值最小值，最小为0
        dotColorMin: {
          type: Number,
          default: 0
        },
        //干扰点颜色色值最大值，最大为255
        dotColorMax: {
          type: Number,
          default: 255
        },
        //画布（图片）宽度
        contentWidth: {
          type: Number,
          default: 112
        },
        //画布（图片）高度
        contentHeight: {
          type: Number,
          default: 38
        }
      },
      methods: {
        // 生成一个随机数
        randomNum (min, max) {
          return Math.floor(Math.random() * (max - min) + min)
        },
        // 生成一个随机的颜色
        randomColor (min, max) {
          let r = this.randomNum(min, max)
          let g = this.randomNum(min, max)
          let b = this.randomNum(min, max)
          return 'rgb(' + r + ',' + g + ',' + b + ')'
        },
        //利用canvas，生成图片验证码
        drawPic () {
          let canvas = document.getElementById('s-canvas')
          let ctx = canvas.getContext('2d')
          ctx.textBaseline = 'bottom'
          // 绘制背景
          ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
          ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
          // 绘制文字
          for (let i = 0; i < this.identifyCode.length; i++) {
            this.drawText(ctx, this.identifyCode[i], i)
          }
          this.drawLine(ctx)
          this.drawDot(ctx)
        },
        //画验证码
        drawText (ctx, txt, i) {
          ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
          ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
          let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
          let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
          var deg = this.randomNum(-45, 45)
          // 修改坐标原点和旋转角度
          ctx.translate(x, y)
          ctx.rotate(deg * Math.PI / 180)
          ctx.fillText(txt, 0, 0)
          // 恢复坐标原点和旋转角度
          ctx.rotate(-deg * Math.PI / 180)
          ctx.translate(-x, -y)
        },
        drawLine (ctx) {
          // 绘制干扰线
          for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
            ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
            ctx.stroke()
          }
        },
        drawDot (ctx) {
          // 绘制干扰点
          for (let i = 0; i < 100; i++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
            ctx.fill()
          }
        }
      },
      watch: {
        identifyCode () {
          this.drawPic()
        }
      },
      //初始生成验证码
      mounted () {
        this.drawPic()
      }
    }
  </script>
  