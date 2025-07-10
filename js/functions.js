function download(fileName, commands) {
  const file = new File([commands], fileName + ".mcfunction", {
    type: "text/plain",
  });

  const tmpLink = document.createElement("a");
  const objectUrl = URL.createObjectURL(file); // 此处应该是 file 而不是 downfile

  tmpLink.href = objectUrl;
  tmpLink.download = file.name; // 此处应该是 file.name 而不是 downfile.name
  document.body.appendChild(tmpLink);
  tmpLink.click();

  document.body.removeChild(tmpLink);
  URL.revokeObjectURL(objectUrl);
}
