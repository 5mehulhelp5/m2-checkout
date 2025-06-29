define(
    [
        'ko',
        'jquery',
        'Magento_Checkout/js/view/payment/default',
        'Tabby_Checkout/js/action/redirect-on-success',
        'Tabby_Checkout/js/model/tabby_checkout'
    ],
    function (ko, $, Component, redirectOnSuccessAction, modelTabbyCheckout) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Tabby_Checkout/payment/form',
                redirectAfterPlaceOrder: false
            },
            isTabbyPlaceOrderActionAllowed: ko.observable(false),

            initialize: function () {
                this._super();

                this.isPlaceOrderActionAllowed = ko.computed({
                    read: this.isTabbyPlaceOrderActionAllowed,
                    write: function (value) { },
                    owner: this
                }),

                this.isChecked.subscribe(function (method) {
                    if (method == this.getCode()) {
                        modelTabbyCheckout.setProduct(this.getTabbyCode());
                    }
                }, this);

                if (this.isChecked() == this.getCode()) {
                    modelTabbyCheckout.setProduct(this.getTabbyCode());
                }

                return this;
            },
            /**
            * Get payment method data
            */
            register: function (renderer) {
                modelTabbyCheckout.registerRenderer(renderer);
            },
            enableButton: function () {
                this.isTabbyPlaceOrderActionAllowed(true);
            },
            disableButton: function () {
                this.isTabbyPlaceOrderActionAllowed(false);
            },
            getHideMethods: function () {
                return window.checkoutConfig.payment.tabby_checkout.config.hideMethods;
            },
            getShowLogo: function () {
                return window.checkoutConfig.payment.tabby_checkout.config.showLogo;
            },
            getPaymentLogoSrc: function () {
                return window.checkoutConfig.payment.tabby_checkout.config.paymentLogoSrc;
            },
            getPaymentInfoImageSrc: function () {
                return window.checkoutConfig.payment.tabby_checkout.config.paymentInfoSrc;
            },
            getPaymentInfoHref: function () {
                return window.checkoutConfig.payment.tabby_checkout.config.paymentInfoHref;
            },
            getCanShowTextDescription: function () {
                return window.checkoutConfig.payment.tabby_checkout.methods[this.getCode()].description_type == 2;
            },
            getTextDescription: function () {
                return this.getCanShowTextDescription() ? this.getMethodDescription() : '';
            },
            getDescriptionDivId: function () {
                return this.getTabbyCode() + 'Card';
            },
            placeTabbyOrder: function () {
                Component.prototype.placeOrder.apply(this, this.getData());
            },
            afterPlaceOrder: function (data, event) {
                redirectOnSuccessAction.execute();
            },
            getCode: function () {
                return 'tabby_base';
            },
            getTabbyCode: function () {
                return 'base';
            },
            getTabbyPrice: function () {
                return modelTabbyCheckout.getGrandTotal();
            },
            getTabbyCurrency: function () {
                return modelTabbyCheckout.getTabbyCurrency();
            },
            getMethodDescription: function () {
                return '';
            },
            getInstallmentsCount: function () {
                return window.checkoutConfig.payment.tabby_checkout.methods[this.getCode()].installments_count;
            },
            getLanguageCode: function () {
                if (modelTabbyCheckout.config.lang) {
                    return modelTabbyCheckout.config.lang.substring(0, 2).toLowerCase();
                } else {
                    return 'en';
                }
            }
        });
    }
);
