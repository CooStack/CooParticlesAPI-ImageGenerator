class Particle {
	constructor() {
		this.start = -3.14;
		this.end = 3.14;
		this.step = .01;
		this.color = "#00aaff";
		this.scale = 1;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.animation = false;
		this.grow = 0;
		this.PassDraw_of_color = true;
		
		this.particles = 0;
		this.command = null;
	}
	
	createParticle(tag, x, y, z, color) {
		
		// 转义成three能识别的类型
		color = parseInt((color.toString()).slice(1), 16);
		
	  // 创建粒子的几何和材质
	  const geometry = new THREE.BufferGeometry(); // 使用BufferGeometry以提高性能
	  const material = new THREE.PointsMaterial({ color: color, size: .5 }); // 使用PointsMaterial定义粒子的材质
	
	  // 定义粒子的位置和属性
	  const positions = new Float32Array([x, y, z]); // 粒子的位置
	  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // 添加位置属性
	
	  // 创建粒子对象
	  const particle = new THREE.Points(geometry, material);
	  particle.userData.tag = tag; // 添加标签
	  particle.userData.class = "particle";
	
	  // 将粒子添加到场景中
	  scene.add(particle);
	}

	hexToRgb(hex) { // HEX 转换 RGB
		// 去除十六进制颜色值中的#号
		hex = hex.replace("#", "");
	
		// 将十六进制颜色值分割成红、绿、蓝三个通道的值
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);
	
		// 返回RGB颜色值
		return (r / 255).toFixed(2) + ' ' + (g / 255).toFixed(2) + ' ' + (b / 255).toFixed(2) + ' 1';
	}
}