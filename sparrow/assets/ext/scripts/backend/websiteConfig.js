document.ready(function() {
	$.file.validateUploadFile = function(f, key) {
		if ($.file.checkFileType(file.getFileName(f.value),["jpg",
				"jpeg", "gif", "png"], key == 'logo' ? "errorLogo"
				: "errorBanner")) {
			file.uploadCallBack = function(fileInfo, clientFileName) {
				if (fileInfo.FileName) {
					if (key === "logo") {
						$("imgLogo").innerHTML = "<img src='"
								+ fileInfo.FileName + "'/>";
						$("hdnLogo").value = fileInfo.FileName;
					} else if (key === "banner") {
						$("hdnBanner").value = fileInfo.FileName;
						$("imgBanner").innerHTML = "<img src='"
								+ fileInfo.FileName + "'/>";
					}
				}
			};
			file.uploadClick(false, "", key);
		}
	};
});