class Func extends Item {
	constructor(id) {
		super(id, "Func");
		this.expression = "y = sin(x)";
		
		this.getExpression();
	}
	
	addItem() {
		$(".add").before(itemSkeleton(this));
		console.log("id: ", this.id);
		function itemSkeleton(obj) {
			let html  = `<div class="item" id="item${obj.id}">
						<div class="type">
							<index>${obj.id}</index>
							<div class="flag">Fx</div>
						</div>
						<button class="delete" title="删除">×</button>
						
						<div class="expressionBox">
							<!-- 名称定义 -->
							<input type="text" class="expression" id="expression${obj.id}" value="y = sin(x)" placeholder="func"><br>
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

	getExpression() {
		$(`#expression${this.id}`).on('input', ()=>{
			let value = $(`#expression${this.id}`).val();
			
			if (regex.test(value)) {
				console.log(true);
			} else {
				console.log(false);
			}
		});
	}
}