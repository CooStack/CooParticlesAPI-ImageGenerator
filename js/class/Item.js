// 引入后期处理库
// import { EffectComposer } from 'js/plugins/threejs/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'js/plugins/threejs/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'js/plugins/threejs/jsm/postprocessing/UnrealBloomPass.js';


class Item extends Particle {
	constructor(id, name, type) {
		super();
		this.id = id;
		this.name = name;
		this.type = type;

		this.__init__();
		this.addItem();
		this.itemFocus();
		this.slideUpFocus();
		this.deleteObject();

		ObjectMenu.countItem++;
	}
	__init__() {
		if (this.grow != 0) {
			this.animation = true;
		} else {
			this.animation = false;
		}
	}

	// 删除粒子
	deleteParticleObjects(tag) {

		// 创建一个数组来保存匹配的对象
		var objectsToRemove = [];

		// 遍历场景中的所有对象
		scene.traverse((object) => {
			// 检查对象是否有标签为"a"
			if (object.userData.tag === tag) {
				// 将匹配的对象添加到数组中
				objectsToRemove.push(object);
			}
		});

		// 从数组中移除所有匹配的对象，使场景中只保留当前生成的粒子
		for (var i = 0; i < objectsToRemove.length; i++) {
			var object = objectsToRemove[i];
			scene.remove(object);

			// 释放对象资源
			object.geometry.dispose(); // 释放几何体资源
			object.material.dispose(); // 释放材质资源
			object = null; // 将变量设置为null以便垃圾回收机制回收内存
		}

		this.itemFocus();
	}

	getValue() {
		$(`#item${this.id}`).on('input', (e) => {

			let id = e.target.id;

			if (this.grow == 0) {
				this.animation = false;
			} else {
				this.animation = true;
				this.draw(this.animation);
			}

			switch (id) {
				case "start":
				case "end":
				case "step":
				case "x":
				case "y":
				case "z":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "scale":
					this[id] = Number($(`#item${this.id} #${id}`).val());
					this.draw(0);
					break;
				case "grow":
					this[id] = Number($(`#item${this.id} #${id}`).val());
					this.draw(this.animation);
					break;
				case "color":
					this.color = $(`#item${this.id} #${id}`).val();
					this.draw(0);
					break;
				case "showMode":
					this.showMode = $(`#item${this.id} #${id}`).val();
					this.draw(this.animation);
			}
		})
	}

	itemFocus() {
		let items = $(`.item`);
		let SUps = $(`.slideUp`);

		for (let i = 0; i < items.length; i++) {
			$(items[i]).click(() => {
				focus(i);
			})
		}


		function focus(index) {
			for (let i = 0; i < items.length; i++) {
				if (i != index) {
					$(items[i]).css({
						"border": "1px solid transparent",
						"border-bottom": "2px solid transparent"
					})
					$(`.item:eq(${i}) .type index`).css({
						"color": "#fff"
					})
				}
			}
			$(items[index]).css({
				"border": "1px solid #6a93d1",
				"border-bottom": "2px solid #6a93d1"
			})
			$(`.item:eq(${index}) .type index`).css({
				"color": "#fff"
			})
			slideUp(index);
		}

		function slideUp(index) {
			for (let i = 0; i < SUps.length; i++) {
				if (i != index) $(`.item:eq(${i}) .sonParameter`).slideUp(300)
			}
			$(`.item:eq(${index}) .sonParameter`).slideDown(300)
		}
	}
	slideUpFocus() {
		$(`.slideUp`).click(() => {
			setTimeout(() => {
				$(`.item .sonParameter`).slideUp(240);
			})
			console.log("slideUpFocus");
		});
	}
	deleteObject() {
		let $id = $(`#item${this.id} .delete`)

		$id.click(() => {
			$(`#item${this.id}`).remove();

			delete this;

			this.deleteParticleObjects(`particleGroup${this.id}`)

			ObjectMenu.countItem--;
		})
	}

	copyHandle(content) { // 指令复制
		if (content != undefined) {
			let copy = (e) => {
				e.preventDefault()
				e.clipboardData.setData('text/plain', content)

				document.removeEventListener('copy', copy)
			}
			document.addEventListener('copy', copy)
			document.execCommand("Copy");
			// alert("复制成功");
		} else {}
	}
}