class Fourier extends Item {
	constructor(id) {
		super(id, "Fourier" + id);

		// init
		this.showMode = "polar";
		this.i = this.start;
		this.rotors = [
			[7, 4, 0],
			[-10, -3, 0]
		];
		this.countRotor = 0;
		this.loop = setInterval(function() {});
		this.rotateX = 90;
		// UI 控件
		this.initRotor();
		this.alterRotorCount();
		super.getValue();
		this.draw(0);
		this.onclickCopyCommand();
	}

	addItem() {
		$(".add").before(itemSkeleton(this));
		console.log("id: ", this.id)

		function itemSkeleton(obj) {
			let html =
				`<div class="item" id="item${obj.id}">
						<div class="type">
							<index>${obj.id}</index>
							<div class="flag">F</div>
						</div>
						<button class="delete" title="删除">×</button>
						
						<div class="expressionBox">
							<!-- 名称定义 -->
							<input type="text" id="expressionName" value="${obj.name}" placeholder="名称"><br>
							
							<!-- 基本设置 -->
							<div class="set" id="set${obj.id}">
								<button id="copy" title="复制指令">copy</button>
								<input type="number" id="start" value="${obj.start}" step="3.14"> ≤ t ≤
								<input type="number" id="end" value="${obj.end}" step="3.14">
								步长：<input type="number" id="step" value="${obj.step}" step="0.01" min="0.005">
							</div>
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
									<tr>
										<td>缩放比</td>
										<td><input type="number" id="scale" value="1" min="0" step="0.1" placeholder="scale"></td>
									</tr>
									<tr>
										<td>翻转</td>
										<td><input type="number" id="rotateX" step="5" value = 90 placeholder="rotateX"></td>
										<td><input type="number" id="rotateY" step="5" placeholder="rotateY"></td>
										<td><input type="number" id="rotateZ" step="5" placeholder="rotateZ"></td>
									</tr>
									<tr>
										<td>生长动画</td>
										<td><input type="number" id="grow" value="0" min="0" step="1" placeholder="grow"></td>
									</tr>
									<tr>
										<td>显示模式</td>
										<td>
											<select id="showMode">
												<option value="polar">极坐标</option>
												<option value="2Dunfold">二维展开</option>
												<option value="3Dunfold">三维展开</option>
											</select>
										</td>
									</tr>
								</table>
							</fieldset>
							<fieldset>
								<legend>旋转因子</legend>
								<table>
									<tr>
										<th>级数</th>
										<th>半径</th>
										<th>转速</th>
										<th>初始角</th>
									</tr>
								</table>
								<table id="RTable${obj.id}"></table>
								<div class="sonChange">
									<button id="removeRotor">remove</button>
									<button id="addRotor">add</button>
								</div>
							</fieldset>
							
							<button class="slideUp" title="收起">︿</button>
						</div>
					</div>`;
			return html;
		}
	}
	initRotor() {
		let $RTalbe = $(`#RTable${this.id}`);

		$RTalbe.empty();

		this.countRotor = 0;

		for (let i = 0; i < this.rotors.length; i++, this.countRotor++) {
			$RTalbe.append(rotorTrGroup(i, this.rotors[i]));
			inputs(i, this);
		}

		function rotorTrGroup(index, thisRotor) {
			let html =
				`<tr id="rotor${index}">
					<td>f${index}</td>
					<td><input type="number" id="r" value="${thisRotor[0]}" placeholder="r"></td>
					<td><input type="number" id="a" value="${thisRotor[1]}" placeholder="a"></td>
					<td><input type="number" id="ir" value="${thisRotor[2]}" step="0.1" placeholder="ir"></td>
				</tr>`
			return html;
		}

		function inputs(i, obj) {
			let $r = $(`#RTable${obj.id} #rotor${i} #r`);
			let $a = $(`#RTable${obj.id} #rotor${i} #a`);
			let $ir = $(`#RTable${obj.id} #rotor${i} #ir`);

			$r.on('input', function() {
				let value = $r.val();
				obj.rotors[i][0] = Number(value);
				obj.draw(0);
			});

			$a.on('input', function() {
				let value = $a.val();
				obj.rotors[i][1] = Number(value);
				obj.draw(0);
			});

			$ir.on('input', function() {
				let value = $ir.val();
				obj.rotors[i][2] = Number(value);
				obj.draw(0);
			});
		}
	}
	alterRotorCount() { // 更改旋转因子数量
		$(`#item${this.id} #removeRotor`).click(() => {
			add_or_removeRotor(false, this);
		});

		$(`#item${this.id} #addRotor`).click(() => {
			add_or_removeRotor(true, this);
		});

		// 增删旋转因子
		function add_or_removeRotor(sgin, obj) {
			if (sgin == true) {
				obj.countRotor++;
				obj.rotors.push([0, 0, 0]);
				obj.initRotor();
			} else {
				if (obj.countRotor > 1) {
					obj.rotors.splice(--obj.countRotor);
					obj.initRotor();
					obj.draw();
				}
			}
			console.log(
				"rotors: ", obj.rotors,
				"countRotor: ", obj.countRotor
			)
		}
	}
	draw(animation) {
		super.deleteParticleObjects(`particleGroup${this.id}`);
		this.i = this.start;

		this.particles = 0;
		// 遍历粒子
		if (animation) // with animate
		{

			clearInterval(this.loop);
			this.loop = setInterval(() => {

				if (this.i < this.end) {
					for (let j = this.i; j < this.i + this.grow; j++, this.i += this.step) {
						switch (this.showMode) {
							case "polar":
								this.polar_printPoint(this.i);
								break;
							case "2Dunfold":
								this.unfold_printPoint(this.i);
								break;
							case "3Dunfold":
								this.unfold_printPoint(this.i);
								for (let j = 0; j < this.rotors.length; j++) {
									this.finalUnfold_printPoint(this.i, j);
								}
								break;
						}
					}
					// 继续
				} else {
					// 结束
					clearInterval(this.loop);
				}
			}, 17);
		} else // no animate
		{
			switch (this.showMode) {
				case "polar":
					for (let i = this.start; i <= this.end; i += this.step) {
						this.polar_printPoint(i);
					}
					break;
				case "2Dunfold":
					for (let i = this.start; i <= this.end; i += this.step) {
						this.unfold_printPoint(i);
					}
					break;
				case "3Dunfold":
					for (let i = this.start; i <= this.end; i += this.step) {
						this.unfold_printPoint(i);
						for (let j = 0; j < this.rotors.length; j++) {
							this.finalUnfold_printPoint(i, j);
						}
					}
					break;
			}
		}

		$("#particles").text(this.particles);
	}

	polar_printPoint(i) {
		// step1: 级数求和
		let x = 0,
			y = 0,
			z = 0;

		for (let j = 0; j < this.rotors.length; j++) {
			x += this.rotor('sin', this.rotors[j][0], this.rotors[j][1], i, this.rotors[j][2]);
			y += this.rotor('cos', this.rotors[j][0], this.rotors[j][1], i, this.rotors[j][2]);
		}

		let p = this.rotate(x, y, z);

		super.createParticle(`particleGroup${this.id}`, p[0], p[1], p[2], this.color);

		// by the way count
		this.particles++;
	}

	unfold_printPoint(i) {
		// step1: 级数求和
		let x = 0,
			y = 0,
			z = 0;

		for (let j = 0; j < this.rotors.length; j++) {
			x += i;
			y += this.rotor('sin', this.rotors[j][0], this.rotors[j][1], i, this.rotors[j][2]);
		}

		let p = this.rotate(x, y, z);

		super.createParticle(`particleGroup${this.id}`, p[0], p[1], p[2], this.color);

		// by the way count
		this.particles++;
	}

	finalUnfold_printPoint(i, j) {
		// step1: 级数求和
		let spaced = 10;
		let x = i;
		let y = this.rotor('sin', this.rotors[j][0], this.rotors[j][1], i, this.rotors[j][2]);
		let z = spaced * j + spaced;

		let p = this.rotate(x, y, z);

		super.createParticle(`particleGroup${this.id}`, p[0], p[1], p[2], this.color);

		// by the way count
		this.particles++;

	}

	rotor(mode, rc, ac, i, angle) { // 计算级数
		let v;

		switch (mode) {
			case "sin":
				v = rc * Math.sin(ac * i + angle);
				break;
			case "cos":
				v = rc * Math.cos(ac * i + angle);
				break;
			case "tan":
				v = rc * Math.tan(ac * i + angle);
				break;
			default:
				console.error("no find it");
		}

		return v;
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
		let $copyBtn = $(`#item${this.id} #copy`);

		$copyBtn.click(() => {
			this.toMinecraftCommand();

			// textTip
			$copyBtn.text("copied!");
			setTimeout(() => {
				$copyBtn.css('opacity', 0);
			}, 1500);
			setTimeout(() => {
				$copyBtn.css('opacity', 1);
				$copyBtn.text("copy");
			}, 1700);
		});
	}

	toMinecraftCommand() {

		console.log(`copy ${this.id}`);

		let adjust = 57.32;

		let plexX = "0";
		let plexY = "0";
		let plexZ = "0";

		for (let i = 0; i < this.rotors.length; i++) {
			plexX += `+${this.rotors[i][0]}*cos(t*${this.rotors[i][1]}+${this.rotors[i][2]})`;
			plexY += `+${this.rotors[i][0]}*sin(t*${this.rotors[i][1]}+${this.rotors[i][2]})`;
		}

		let scale = `scale=${this.scale * .5};`;
		let rotateX = `rotateX=${this.rotateX / adjust};`;
		let rotateY = `rotateY=${this.rotateY / adjust};`;
		let rotateZ = `rotateZ=${this.rotateZ / adjust};`;

		let parameters = scale + rotateX + rotateY + rotateZ;

		let EX = `(${plexX})*scale`;
		let EY = `(${plexY})*scale`;
		let EZ = `(${plexZ})*scale`;

		// rotateX
		let Es = commandRotate(EX, EY, EZ);
		EX = Es[0];
		EY = Es[1];
		EZ = Es[2];

		let expressions =
			"x=" + EX + ";y=" + EY + ";z=" + EZ + "";

		let thisTick = this.animation ? "tick" : "";
		let thisGrow = this.animation ? " " + this.grow * 3 : "";

		// 当值为零 = ''
		this.x = this.x ? this.x : '';
		this.y = this.y ? this.y : '';
		this.z = this.z ? this.z : '';

		this.command =
			`particleex ${thisTick}parameter minecraft:end_rod ~${this.x} ~${this.y} ~${this.z} ${super.hexToRgb(this.color)} 0 0 0 ${this.start} ${this.end} "${parameters + expressions}" ${this.step}${thisGrow} 0 "vy=0.0"`;

		this.copyHandle(this.command);

		console.log(this.command);

		function commandRotate(ex, ey, ez) {
			// rotateX
			let x1 = ex;
			let y1 = `(${ey})*cos(rotateX)-(${ez})*sin(rotateX)`;
			let z1 = `(${ey})*sin(rotateX)+(${ez})*cos(rotateX)`;

			// rotateY
			let x2 = `(${x1})*cos(rotateY)+(${z1})*sin(rotateY)`;
			let y2 = y1;
			let z2 = `(-${x1})*sin(rotateY)+(${z1})*cos(rotateY)`;

			// rotateZ
			let x3 = `(${x2})*cos(rotateZ)-(${y2})*sin(rotateZ)`;
			let y3 = `(${x2})*sin(rotateZ)+(${y2})*cos(rotateZ)`;
			let z3 = z2;

			return [x3, y3, z3];
		}
	}

}