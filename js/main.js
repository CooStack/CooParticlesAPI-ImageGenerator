// import { EffectComposer } from "./plugins/threejs/UnrealBloomPass/EffectComposer.js";
// import { RenderPass } from "./plugins/threejs/UnrealBloomPass/RenderPass.js";
// import { UnrealBloomPass } from "./plugins/threejs/UnrealBloomPass/UnrealBloomPass.js";
// 创建场景对象	
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeff4fa);

var width = $(".canvas-container").width()
var height = $(".canvas-container").height()
// 创建相机对象
var camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
camera.position.set(-30, 15, 30);

// 创建渲染器对象
var renderer = new THREE.WebGLRenderer({
	antialias: true
});
// 设置渲染器大小
renderer.setSize(width, height);

// 将渲染器添加到页面中
var canvasContainer = document.querySelector('.canvas-container');
canvasContainer.appendChild(renderer.domElement);


// 添加网格辅助对象，用于显示刻度网格
let gridHelper = new THREE.GridHelper(100, 30, 0xececec, 0xececec);
gridHelper.material.color.set(0x999999); // 设置颜色为红色
scene.add(gridHelper);

// 创建AxesHelper对象(xyz)
let axesHelper = new THREE.AxesHelper(10);
axesHelper.position.set(0, .01, 0);
// 将AxesHelper对象添加到场景中
scene.add(axesHelper);
// 创建xyz辅助轴
// myAxes();

let circularMotion = false;
// 创建一个点作为中心点
let centerPoint = new THREE.Vector3(0, 0, 0);

// 添加鼠标控制
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼
controls.dampingFactor = 0.05; // 阻尼系数
controls.rotateSpeed = 0.5; // 将旋转速度调整为0.5


let angle = 0;
// 渲染场景
function animate() {
	requestAnimationFrame(animate);
	controls.update();

	if (circularMotion) {
		// 让摄像机绕中心点做圆周旋转
		angle += 0.0025; // 获取当前时间
		var radius = 50; // 圆的半径
		camera.position.x = centerPoint.x + radius * Math.cos(angle); // 根据极坐标计算摄像机位置
		camera.position.z = centerPoint.z + radius * Math.sin(angle);
		camera.lookAt(centerPoint); // 让摄像机一直朝向中心点
	}
	
	renderer.render(scene, camera);
}
animate();





// 创建一个纹理加载器 - 创建粒子
const end_rod = new THREE.TextureLoader();


// 加载图片纹理 - 加载粒子
function particleLoad(tag, x, y, z) {
	end_rod.load('img/endRod/glitter_3.png', (texture) => {
		// texture.magFilter = THREE.NearestFilter; // Set the mag filter to nearest to avoid pixelation
		// 创建材质并设置纹理
		const material = new THREE.SpriteMaterial({
			map: texture,
			color: 0x000000, // 可选，用于调整颜色
		});

		// 创建粒子并设置材质和大小
		const sprite = new THREE.Sprite(material);

		// 为对象添加标签
		sprite.userData.tag = tag;
		sprite.userData.class = "partilce";

		sprite.scale.set(.5, .5, .5); // 可以根据需要调整大小
		sprite.position.x = x;
		sprite.position.y = y;
		sprite.position.z = z;
		// 将粒子添加到场景中
		scene.add(sprite);
	});
}



function myAxes() {
	var cylinder = new THREE.CylinderGeometry(.1, .1, 34, 32);
	var Cone = new THREE.CylinderGeometry(0.05, .3, 1, 32);
	// 材质
	const materialBlue = new THREE.MeshBasicMaterial({
		color: 0x3f59a6
	});
	const materialRed = new THREE.MeshBasicMaterial({
		color: 0xd31e27
	});
	const materialGreen = new THREE.MeshBasicMaterial({
		color: 0x0fa547
	});

	// 对象
	const axesZ = new THREE.Mesh(cylinder, materialBlue);
	axesZ.rotation.x = Math.PI / 2;

	const ConeZ1 = new THREE.Mesh(Cone, materialBlue);
	ConeZ1.rotation.x = Math.PI / 2;
	ConeZ1.position.z = 17
	const ConeZ2 = new THREE.Mesh(Cone, materialBlue);
	ConeZ2.rotation.x = -Math.PI / 2;
	ConeZ2.position.z = -17

	const axesX = new THREE.Mesh(cylinder, materialRed);
	axesX.rotation.z = Math.PI / 2;

	const ConeX1 = new THREE.Mesh(Cone, materialRed);
	ConeX1.rotation.z = -Math.PI / 2;
	ConeX1.position.x = 17
	const ConeX2 = new THREE.Mesh(Cone, materialRed);
	ConeX2.rotation.z = Math.PI / 2;
	ConeX2.position.x = -17

	const axesY = new THREE.Mesh(cylinder, materialGreen);
	axesX.rotation.z = Math.PI / 2;

	const ConeY1 = new THREE.Mesh(Cone, materialGreen);
	ConeY1.position.y = 17
	const ConeY2 = new THREE.Mesh(Cone, materialGreen);
	ConeY2.rotation.x = -Math.PI;
	ConeY2.position.y = -17

	scene.add(
		axesX, ConeX1, ConeX2,
		axesY, ConeY1, ConeY2,
		axesZ, ConeZ1, ConeZ2,
	);
}

// myAxes();