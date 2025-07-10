class PolygonInCircle extends Item {
    constructor(id) {
        super(id, "Polygon" + id);

        // init
        this.showMode = "Polygon";
        this.i = this.start;
        this.polygonInSettings = [
            10.0, 3, 50
        ]
        this.loop = setInterval(function () {
        });

        // UI 控件
        this.initPolygon();
        super.getValue();
        this.draw(0);
    }

    addItem() {
        $(".add").before(itemSkeleton(this));
        console.log("id: ", this.id)

        function itemSkeleton(obj) {
            let html =
                `<div class="item" id="item${obj.id}">
						<div class="type">
							<index>${obj.id}</index>
							<div class="flag">P</div>
						</div>
						<button class="delete" title="删除">×</button>
						
						<div class="expressionBox">
							<!-- 名称定义 -->
							<input type="text" id="expressionName" value="${obj.name}" placeholder="名称"><br>
							
						</div>
						
						<div class="sonParameter">
							<fieldset>
								<legend>基本设置</legend>
								<table id="BTable${obj.id}">
									<tr>
										<td>坐标</td>
										<td><input type="number" id="x" placeholder="x"></td>
										<td><input type="number" id="y" placeholder="y"></td>
										<td><input type="number" id="z" placeholder="z"></td>
									</tr>
									<tr>
										<td>颜色</td>
										<td><input type="color" id="color" value="#00aaff" placeholder="color"></td>
									</tr>
									<tr>z
										<td>缩放比</td>
										<td><input type="number" id="scale" value="1" min="0" step="0.1" placeholder="scale"></td>
									</tr>
									<tr>
										<td>翻转</td>
										<td><input type="number" id="rotateX" step="5" placeholder="rotateX"></td>
										<td><input type="number" id="rotateY" step="5" placeholder="rotateY"></td>
										<td><input type="number" id="rotateZ" step="5" placeholder="rotateZ"></td>
									</tr>
								</table>
							</fieldset>
							<fieldset>
								<legend>参数设置</legend>
								<table>
									<tr>
										<th>半径</th>
										<th>边数</th>
										<th>边粒子数</th>
									</tr>
								</table>
								<table id="RTable${obj.id}"></table>
							</fieldset>
							
							<button class="slideUp" title="收起">︿</button>
						</div>
					</div>`;
            return html;
        }
    }


    initPolygon() {
        let $table = $(`#RTable${this.id}`);
        $table.empty()
        let thisObj = this
        let html =
            `<tr id="polygon">
                <td><input type="number" id="r" value="${this.polygonInSettings[0]}" placeholder="r"></td>
                <td><input type="number" id="n" value="${this.polygonInSettings[1]}" placeholder="n"></td>
                <td><input type="number" id="edgeCount" value="${this.polygonInSettings[2]}" placeholder="edgeCount"></td>
            </tr>
            `
        $table.append(html);
        let $r = $(`#RTable${this.id} #polygon #r`);
        let $n = $(`#RTable${this.id} #polygon #n`);
        let $edgeCount = $(`#RTable${this.id} #polygon #edgeCount`);

        $r.on('input',function(){
            let v = $r.val();
            thisObj.polygonInSettings[0] = Number(v)
            thisObj.draw(0)
        })

        $n.on('input',function(){
            let v = $n.val();
            thisObj.polygonInSettings[1] = Number(v)
            thisObj.draw(0)
        })

        $edgeCount.on('input',function(){
            let v = $edgeCount.val();
            thisObj.polygonInSettings[2] = Number(v)
            thisObj.draw(0)
        })
    }

    draw(animation) {
        super.deleteParticleObjects(`particleGroup${this.id}`);
        this.i = this.start;
        this.particles = 0;
        // 遍历粒子
        this.polar_printPoint()
        $("#particles").text(this.particles);
    }

    polar_printPoint() {
        let res = this.getPoints(this.polygonInSettings[0],this.polygonInSettings[1],this.polygonInSettings[2])
        res.forEach((n,i)=>{
            let v = n
            let x = v.x
            let y = v.y
            let z = v.z
            let p = this.rotate(x, y, z);
            super.createParticle(`particleGroup${this.id}`, p[0], p[1], p[2], this.color);
            // by the way count
            this.particles++;
        })
    }

    getPoints(r, n, edgeCount) {
        let vertices = []
        let result = []
        for (let i = 0; i < n; i++) {
            let theta = 2 * Math.PI * i / n
            let v = new Vec3d(r * Math.cos(theta), 0.0, r * Math.sin(theta));
            vertices.push(v);
        }
        function getLineLocations(origin, direction, step, count) {
            let res = [origin]
            let relativeDirection =
                new Vec3d(direction.x, direction.y, direction.z).normalize().multiply(step)
            let next = origin
            for (let i = 2; i <= count; i++) {
                next = next.add(relativeDirection)
                res.push(next)
            }
            return res
        }

        for (let i = 0; i < n; i++) {
            let j = (i + 1) % n
            let vi = vertices[i]
            let vj = vertices[j]

            // 计算边的方向向量
            let direction = new Vec3d(vj.x - vi.x, vj.y - vi.y, vj.z - vi.z)
            let length = direction.length()

            // 计算步长（若edgeCount为1，则步长为0，仅包含起点）
            let step = 0
            if (edgeCount > 1) {
                step = length / (edgeCount - 1)
            } else step = 0.0

            // 生成当前边的点集
            let lineLocations = getLineLocations(vi, direction, step, edgeCount)
            // result.concat(lineLocations)
            lineLocations.forEach((p, i) => {
                result.push(p)
            })
        }
        return result
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

    onclickCopyCommand() {
    }

    toMinecraftCommand() {
        console.log(`copy ${this.id}`);
    }

}