class Func extends Item {

    constructor(id) {
        super(id, "Func");

        this.particles = 0;
        this.expression = "sin(x)";
        // this.getExpression();
        this.initFunc(this);
        super.getValue();
        this.draw()
    }

    addItem() {
        $(".add").before(itemSkeleton(this));
        console.log("id: ", this.id);

        function itemSkeleton(obj) {
            let html = `<div class="item" id="item${obj.id}">
						<div class="type">
							<index>${obj.id}</index>
							<div class="flag">Fx</div>
						</div>
						<button class="delete" title="删除">×</button>
						
						<div class="expressionBox">
							<!-- 名称定义 -->
							<div class="expression">y=<input type="text" class="expression" id="expression${obj.id}" value="sin(x)" placeholder="func"></div><br>
						</div>
						
						<div class="sonParameter">
							<fieldset>
								<legend>基本设置</legend>
								<table id="BTable${obj.id}">
									<tr>
										<td>定义域</td>
										<td><input type="number" id="start" value="${obj.start}" placeholder="start"></td>
										<td><input type="number" id="end" value="${obj.end}" placeholder="end"></td>
										<td><input type="number" id="step" value="${obj.step}" step="0.01" min="0.005" placeholder="step"></td>
									</tr>
									<tr>
										<td>坐标</td>
										<td><input type="number" id="x" placeholder="x"></td>
										<td><input type="number" id="y" placeholder="y"></td>
										<td><input type="number" id="z" placeholder="z"></td>
									</tr>
									<tr>
										<td>翻转</td>
										<td><input type="number" id="rotateX" step="15" placeholder="rotateX"></td>
										<td><input type="number" id="rotateY" step="15" placeholder="rotateY"></td>
										<td><input type="number" id="rotateZ" step="15" placeholder="rotateZ"></td>
									</tr>
									<tr>
										<td>颜色</td>
										<td><input type="color" id="color" value="#00aaff" placeholder="color"></td>
									</tr>
									<tr>
										<td>缩放</td>
										<td><input type="number" id="scale" value="1" min="0" step="0.1" placeholder="scale"></td>
									</tr>
								</table>
							</fieldset>
							
							<button class="slideUp" title="收起">︿</button>
						</div>
					</div>`;
            return html;
        }
    }

    initFunc(obj) {
        let $box = $(`#item${this.id} .expressionBox .expression #expression${this.id}`);
        $box.on('input', function(){
            obj.expression = $box.val();
            obj.draw();
        })
    }

    draw_particles_on_time(x) {
        function pow(x, n) {
            return Math.pow(x, n)
        }

        function log(x){
            return Math.log(x)
        }

        function log2(x){
            return Math.log2(x)
        }

        function log1p(x){
            return Math.log1p(x)
        }

        function log10(x){
            return Math.log10(x)
        }

        function asin(x) {
            return Math.asin(x)
        }

        function sinh(x) {
            return Math.sinh(x)
        }

        function asinh(x) {
            return Math.asinh(x)
        }
        function sin(x) {
            return Math.sin(x)
        }

        function acos(x) {
            return Math.acos(x)
        }
        function acosh(x) {
            return Math.acosh(x)
        }

        function cosh(x) {
            return Math.cosh(x)
        }

        function cos(x) {
            return Math.cos(x)
        }

        function tan(x) {
            return Math.tan(x)
        }

        function tanh(x) {
            return Math.tanh(x)
        }

        function atan(x) {
            return Math.atan(x)
        }

        function atanh(x) {
            return Math.atanh(x)
        }

        function cbrt(x){
            return Math.cbrt(x)
        }

        function ceil(x){
            return Math.ceil(x)
        }

        function clz32(x){
            return Math.clz32(x)
        }

        function max(...x){
            return Math.max(x)
        }

        function min(...values){
            return Math.min(values)
        }

        function random(){
            return Math.random()
        }

        function round(x){
            return Math.round(x)
        }

        function fround(x){
            return Math.fround(x)
        }

        let PI = Math.PI
        let y = eval(this.expression.replace("x", x));
        let p = this.rotate(x,y,0)
        this.createParticle(`particleGroup${this.id}`, p[0], p[1], p[2], this.color)
        this.particles++;
    }

    draw() {
        super.deleteParticleObjects(`particleGroup${this.id}`);
        this.particles = 0;
        let start = this.start;
        let end = this.end;
        let step = this.step;
        if (step <= 0){
            step = 0.01
        }
        for (let x = start; x <= end; x += step) {
            this.draw_particles_on_time(x)
        }
        $("#particles").text(this.particles);
    }

    getExpression() {
        $(`#expression${this.id}`).on('input', () => {
            let value = $(`#expression${this.id}`).val();
            if (regex.test(value)) {
                console.log(true);
            } else {
                console.log(false);
            }
        });
    }

    rotate(x, y, z) {
        let point = [
            x * this.scale,
            y * this.scale,
            z * this.scale
        ];

        let adjust = 57.32;
        // 获取角度
        let angleX = this.rotateX / adjust;
        let angleY = this.rotateY / adjust;
        let angleZ = this.rotateZ / adjust;

        // 翻转
        point = this.xRotate(point, angleX);
        point = this.yRotate(point, angleY);
        point = this.zRotate(point, angleZ);

        point[0] += this.x * 2;
        point[1] += this.y * 2;
        point[2] += this.z * 2;

        return point;
    }

    xRotate(point, angle) {
        var y = point[1];
        var z = point[2];
        point[1] = y * Math.cos(angle) - z * Math.sin(angle);
        point[2] = y * Math.sin(angle) + z * Math.cos(angle);
        return point;
    }
    yRotate(point, angle) {
        var x = point[0];
        var z = point[2];
        point[0] = x * Math.cos(angle) + z * Math.sin(angle);
        point[2] = -x * Math.sin(angle) + z * Math.cos(angle);
        return point;
    }
    zRotate(point, angle) {
        var x = point[0];
        var y = point[1];
        point[0] = x * Math.cos(angle) - y * Math.sin(angle);
        point[1] = x * Math.sin(angle) + y * Math.cos(angle);
        return point;
    }
}