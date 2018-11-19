/*

    For example:

    var blockApp = new BlockUI("#app")
    blockApp.block() // or
    blockApp.unblock()

*/

(function () {
    'use strict';

    var BlockUI = function (el) {

        if (typeof el === undefined) {
            throw new Error('Element to block is required')
        }
        this.init.call(this, el)

        var self = this
        
        var publicFunctions = {
            block: function () {
                var domEls = self.getElement(self.config.el);

                if (domEls.length === 0) {
                    throw new Error('No elements named ' + self.config.el)
                }

                Array.prototype.forEach.call(domEls, function (domEl) {
                    domEl.classList.add('block-ui')
                })

                return publicFunctions
            },
            unblock: function () {
                var domEls = self.getElement(self.config.el);

                if (domEls.length === 0) {
                    throw new Error('No element named ' + self.config.el)
                }
                Array.prototype.forEach.call(domEls, function (domEl) {
                    domEl.classList.remove('block-ui')
                })

                return publicFunctions
            }
        }
        return publicFunctions
    }


    BlockUI.prototype.init = function (el) {
        this.config = {
            el: el
        }
    }

    BlockUI.prototype.getElement = function (el) {
        return document.querySelectorAll(el)
    }

    window.BlockUI = BlockUI;
})();

