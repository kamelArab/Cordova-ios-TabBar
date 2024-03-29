/*
    This code is adapted from the work of:
    Created by Michael Nachbaur on 13/04/09.
    Copyright 2009 Decaf Ninja Software. All rights reserved.
    MIT licensed

    API cleaned up and improved by Andreas Sommer (https://github.com/AndiDog/phonegap-ios-tabbar-plugin).
*/

cordova.define("cordova/plugin/iOSTabBar", function(require, exports, module) {
    var exec = require("cordova/exec");
    var TabBar = function() {
        this.tag = 0;
        this.callbacks = {};
        this.selectedItem = null;
        this.enableCallBack=[];
        this.tabToTag={};
    }

    /**
     * Create a native tab bar that can have tab buttons added to it which can respond to events.
     *
     * @param options Additional options:
     *   - selectedImageTintColorRgba: Tint color for selected items (defaults to standard light blue), must define the
     *     color as string e.g. '255,0,0,128' for 50% transparent red. This is only supported on iOS 5 or newer.
     *   - tintColorRgba: Tint color for the bar itself (value as above)
     */
    TabBar.prototype.create = function(options) {
        exec(null, null, "TabBar", "create", [options || {}]);
    };

    /**
     * Create a new tab bar item for use on a previously created tab bar.  Use ::showTabBarItems to show the new item on the tab bar.
     *
     * If the supplied image name is one of the labels listed below, then this method will construct a tab button
     * using the standard system buttons.  Note that if you use one of the system images, that the \c title you supply will be ignored.
     *
     * <b>Tab Buttons</b>
     *   - tabButton:More
     *   - tabButton:Favorites
     *   - tabButton:Featured
     *   - tabButton:TopRated
     *   - tabButton:Recents
     *   - tabButton:Contacts
     *   - tabButton:History
     *   - tabButton:Bookmarks
     *   - tabButton:Search
     *   - tabButton:Downloads
     *   - tabButton:MostRecent
     *   - tabButton:MostViewed
     * @param {String} name internal name to refer to this tab by
     * @param {String} [title] title text to show on the tab, or null if no text should be shown
     * @param {String} [image] image filename or internal identifier to show, or null if now image should be shown
     * @param {Object} [options] Options for customizing the individual tab item
     *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
     */
    TabBar.prototype.createItem = function(name, label, image, options) {
        var tag = this.tag++;

        if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
            this.callbacks[tag] = {onSelect: options.onSelect, name: name};
            //delete options.onSelect;
            this.enableCallBack[tag] = true;
            this.tabToTag[name]= {tag :tag};
        }

        exec(null, null, "TabBar", "createItem", [name, label, image, tag, options]);
    };

    /**
     * Function to detect currently selected tab bar item
     * @see createItem
     * @see showItems
     */
    TabBar.prototype.getSelectedItem = function() {
        return this.selectedItem;
    };

    /**
     * Hide a tab bar.  The tab bar has to be created first.
     */
    TabBar.prototype.hide = function(animate) {
        if (animate === undefined || animate === null)
            animate = true;
        exec(null, null, "TabBar", "hide", [{animate: animate}]);
    };

    /**
     * Must be called before any other method in order to initialize the plugin.
     */
    TabBar.prototype.init = function()
    {
        exec(null, null, "TabBar", "init", []);
    };

    /**
     * Internal function called when a tab bar item has been selected.
     * @param {Number} tag the tag number for the item that has been selected
     */
    TabBar.prototype.onItemSelected = function(tag)
    {
        this.selectedItem = tag;
        if (typeof(this.callbacks[tag].onSelect) == 'function' && this.enableCallBack[tag])
            this.callbacks[tag].onSelect(this.callbacks[tag].name);
        
        this.enableCallBack[tag] = true;
    };

    TabBar.prototype.resize = function() {
        exec(null, null, "TabBar", "resize", []);
    };

    /**
     * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
     * @param {String} tabName the name of the tab to select, or null if all tabs should be deselected
     * @see createItem
     * @see showItems
     */
    TabBar.prototype.selectItem = function(tab) {
        this.enableCallBack[this.tabToTag[tab].tag]=true
        exec(null, null, "TabBar", "selectItem", [tab]);
    };

    TabBar.prototype.selectIcon = function(tab,callback) {
        this.enableCallBack[this.tabToTag[tab].tag]=callback
        exec(null, null, "TabBar", "selectItem", [tab]);
    };

    /**
     * Show a tab bar.  The tab bar has to be created first.
     * @param {Object} [options] Options indicating how the tab bar should be shown:
     * - \c height integer indicating the height of the tab bar (default: \c 49)
     * - \c position specifies whether the tab bar will be placed at the \c top or \c bottom of the screen (default: \c bottom)
     */
    TabBar.prototype.show = function(options) {
        exec(null, null, "TabBar", "show", [options || {}]);
    };

    /**
     * Show previously created items on the tab bar
     * @param {String} arguments... the item names to be shown
     * @param {Object} [options] dictionary of options, notable options including:
     *  - \c animate indicates that the items should animate onto the tab bar
     * @see createItem
     * @see create
     */
    TabBar.prototype.showItems = function() {
        var parameters = [];
        for(var i = 0; i < arguments.length; ++i)
            parameters.push(arguments[i]);
        exec(null, null, "TabBar", "showItems", parameters);
    };

    /**
     * Update an existing tab bar item to change its badge value.
     * @param {String} name internal name used to represent this item when it was created
     * @param {Object} options Options for customizing the individual tab item
     *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
     */
    TabBar.prototype.updateItem = function(name, options) {
        exec(null, null, "TabBar", "updateItem", [name, options || {}]);
    };

    /**
     * Manually add a badge on an individual tab bar item.
     * @param {String} tabName the name of the tab bar item.     
	 * @param {String} badgeValue the value to set on the badge.
     */
    TabBar.prototype.addBadgeOnItem = function(tab,badgeValue) {
        exec(null, null, "TabBar", "addBadgeOnItem", [tab,badgeValue]);
    };
	
    /**
     * Manually remove a badge on an individual tab bar item.
     * @param {String} tabName the name of the tab bar item.    
     */
    TabBar.prototype.clearBadgeOnItem = function(tab) {
        exec(null, null, "TabBar", "clearBadgeOnItem", [tab]);
    };

    module.exports = new TabBar();
});
