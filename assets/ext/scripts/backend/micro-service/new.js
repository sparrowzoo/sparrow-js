var microServiceController = {
	api: {
		save: "save",
		manage: "manage",
		app_tooltip: "/app/tooltip.json"
	},
	appTooltipTree: null,
	loadAppTooltip: function () {
		microServiceController.appTooltipTree = new $.tree("appTooltipTree");
		microServiceController.appTooltipTree.config.floatTreeId = "divAppTooltip";
		microServiceController.appTooltipTree.config.descHiddenId = "hdnAppId";
		microServiceController.appTooltipTree.config.descTextBoxId = "txtAppName";
	},

	load: function () {
		this.loadAppTooltip();
		document.domain = $.browser.cookie.root_domain;
		$.file.initImageUploadEvent('micro_service', "MicroServiceLogo");
		$.dispatcher.eventRegistry = [
			{
				id: "btnReturn",
				delegate: function (e, srcElement) {
					window.location.href = microServiceController.api.manage;
				},
				strategy: lang.command.return
			},
			{
				id: "btnSave",
				delegate: function (e, srcElement) {
					$.v.getValidateResult(microServiceInfo, function () {
						$.submit(microServiceController.api.save);
					});
				},
				strategy: lang.command.save
			},
			{
				id: "txtAppName",
				delegate: function (e, srcElement) {
					microServiceController.appTooltipTree.initCodeTooltip('', $.url.root + microServiceController.api.app_tooltip);
					microServiceController.appTooltipTree.show(e, 200, 250);
				}
			}
		];
		$.dispatcher.bind();
	}
};
define("microService", [], function () {
	return microServiceController;
});