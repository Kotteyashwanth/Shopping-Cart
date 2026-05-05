sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project11.controller.Cart", {

        _lastDeletedItem: null,
        _lastDeletedIndex: null,

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("main");
        },

        onIncrease: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oItem = oContext.getObject();

            if (oItem.Quantity < 6) {
                oItem.Quantity += 1;
            } else {
                MessageToast.show("Max 6 allowed");
            }

            oContext.getModel().refresh(true);
        },

        onDecrease: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oItem = oContext.getObject();

            if (oItem.Quantity > 1) {
                oItem.Quantity -= 1;
            } else {
                this.onRemove(oEvent);
                return;
            }

            oContext.getModel().refresh(true);
        },

        onRemove: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/cartItems") || [];

            var iIndex = parseInt(oContext.getPath().split("/").pop());

            this._lastDeletedItem = aItems[iIndex];
            this._lastDeletedIndex = iIndex;

            aItems.splice(iIndex, 1);

            oModel.setProperty("/cartItems", aItems);
            oModel.refresh(true);

            this.byId("undoStrip").setVisible(true);

            MessageToast.show("Item removed");
        },

        onUndoDelete: function () {
            if (this._lastDeletedItem !== null) {

                var oModel = this.getOwnerComponent().getModel("cart");
                var aItems = oModel.getProperty("/cartItems") || [];

                aItems.splice(this._lastDeletedIndex, 0, this._lastDeletedItem);

                oModel.setProperty("/cartItems", aItems);
                oModel.refresh(true);

                this.byId("undoStrip").setVisible(false);

                this._lastDeletedItem = null;
                this._lastDeletedIndex = null;

                MessageToast.show("Item restored");
            }
        },

        formatLineTotal: function (price, qty) {
            if (!price || !qty) {
                return "0.00";
            }
            return "Total: " + (price * qty).toFixed(2);
        },

        getGrandTotal: function (items) {
            if (!items || items.length === 0) {
                return "Grand Total: 0.00";
            }

            var total = 0;

            items.forEach(function (item) {
                total += item.Price * item.Quantity;
            });

            return "Grand Total: " + total.toFixed(2);
        }

    });
});
