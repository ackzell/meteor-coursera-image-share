// routing

Router.configure({
    // create a super template to insert other templates
    layoutTemplate: 'ApplicationLayout' 
});

Router.route('/', function () {
  this.render('welcome', {
    to: 'main' // will be rendered to the main yield
  });
});

Router.route('/images', function () {
  this.render('navbar', {
    to: 'navbar'
  });
  this.render('images', {
    to: 'main'
  });
});

Router.route('/image/:_id', function() {
    this.render('navbar', {
        to: 'navbar'
    });
    this.render('image', {
        to: 'main',
        data: function() {
            return Images.findOne({_id: this.params._id});
        }
    });
});

// infiniscroll
Session.set('imageLimit', 2);
lastScrollTop = 0;

$(window).scroll(function(event) {
    // test if we are near the bottom of the window
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        var scrollTop = $(this).scrollTop();
        // see if we are going up or down
        if (scrollTop > lastScrollTop) {
            console.log('going down at the bottom!');
            Session.set('imageLimit', Session.get('imageLimit') + 1);
        }
        lastScrollTop = scrollTop;
    }
});

//accounts config

Accounts.ui.config({
    requestPermissions: {
        // facebook: ['user_likes']
    },
    requestOfflineToken: {
        // google: true
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});

Template.images.helpers({
    imgs: function() {
        if (Session.get('userFilter')) {
            return Images.find({
                createdBy: Session.get('userFilter')
            }, {
                sort: {
                    createdOn: -1,
                    rating: -1
                },
                limit: Session.get('imageLimit')
            });
        } else {
            return Images.find({}, {
                sort: {
                    createdOn: -1,
                    rating: -1
                },
                limit: Session.get('imageLimit')
            });
        }
    },
    filtering_images: function() {
        if (Session.get('userFilter')) {
            return true;
        } else {
            return false;
        }
    },
    getUser: function(user_id) {
        var user = Meteor.users.findOne({
            _id: user_id
        });
        if (user) {
            return user.username;
        } else {
            return 'anonymous';
        }
    },
    getFilterUser: function() {
        if (Session.get('userFilter')) {
            return Meteor.users.findOne({
                _id: Session.get('userFilter')
            }).username;
        }
    }

});

Template.body.helpers({
    username: function() {
        if (Meteor.user()) {
            return Meteor.user().username;
        } else {
            return 'Anonymous user';
        }
    }
});

Template.images.events({
    'click .js-image': function(event) {
        $(event.target).css('width', '50px');
    },

    'click .js-del-image': function(event) {
        var image_id = this._id;
        console.log('image_id', image_id);
        $('#' + image_id).hide('slow', function() {
            Images.remove({
                '_id': image_id
            });
        });
    },

    'click .js-rate-image': function(event) {
        var rating = $(event.currentTarget).data('userrating');
        console.log('rating', rating);
        var image_id = this.photoid;
        console.log('image_id', image_id);

        Images.update({
            _id: image_id
        }, {
            $set: {
                rating: rating
            }
        });
    },

    'click .js-show-image-form': function(event) {
        $('#image_add_form').modal('show');
    },

    'click .js-set-image-filter': function(event) {
        Session.set('userFilter', this.createdBy);
    },

    'click .js-unset-image-filter': function(event) {
        Session.set('userFilter', undefined);
    }

});

Template.image_add_form.events({
    'submit .js-add-image': function(event) {
        var img_src = event.target.image_src.value,
            img_alt = event.target.image_alt.value;

        console.log('img_src', img_src);
        console.log('img_alt', img_alt);

        if (Meteor.user()) {
            Images.insert({
                img_src: img_src,
                img_alt: img_alt,
                createdOn: new Date(),
                createdBy: Meteor.user()._id
            }, function() {
                event.target.image_src.value = '';
                event.target.image_alt.value = '';
                $('#image_add_form').modal('hide');
            });
        }

        //stop the default event
        return false;
    }
});