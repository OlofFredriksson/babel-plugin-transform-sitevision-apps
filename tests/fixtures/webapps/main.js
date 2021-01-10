/* global _ */
import Component from "Component";
export default Component.extend({
    onRendered: function () {
        console.log(this.state.name); // foo
    },

    // collect the information a component needs from the store
    // always return a new object
    filterState: function (state) {
        return _.extend({}, { name: state.name });
    },
});
