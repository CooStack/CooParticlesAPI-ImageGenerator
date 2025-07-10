let fileCount = 0;
$(".export").click(() => {
	let commands = "";

	// 遍历 command
	for (let i = 0; i < ObjectMenu.FourierObjects.length; i ++) {
		ObjectMenu.FourierObjects[i].toMinecraftCommand();
		
		
		let name = "# " + ObjectMenu.FourierObjects[i].name;
		let command = ObjectMenu.FourierObjects[i].command;
		
		
		commands += name + '\n' + command + '\n';
	}
	
	if (commands != "") {
		download("fourier" + fileCount, commands);
	} else {
		alert("请先创建一个函数");
	}

	fileCount++;
});