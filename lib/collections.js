Images = new Mongo.Collection('images');

// Set up security on Images collection
Images.allow({
    insert: function (userId, doc) {
       //  they are logged in
        if (Meteor.user()) {
            console.log('doc', doc);
            // user is probably messing around
            if (userId !== doc.createdBy) {
                return false;
            } else { // all good
                return true;
            }
        } else { // user is not logged in
            return false;
        }
    },
    remove: function (userId, doc) {
        return true;
    },
    update: function (userId, doc) {
       //  they are logged in
        if (Meteor.user()) {
            console.log('doc', doc);
            // user is probably messing around
            if (userId !== doc.createdBy) {
                return false;
            } else { // all good
                return true;
            }
        } else { // user is not logged in
            return false;
        }
    },
});