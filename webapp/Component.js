sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("project11.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            var aSavedCart = [];
            try {
                aSavedCart = JSON.parse(window.localStorage.getItem("cartItems") || "[]");
                if (!Array.isArray(aSavedCart)) {
                    aSavedCart = [];
                }
            } catch (e) {
                aSavedCart = [];
            }

            var oCartModel = new JSONModel({
                cartItems: aSavedCart
            });

            this.setModel(oCartModel, "cart");
            this.getRouter().initialize();
        }
    });
});