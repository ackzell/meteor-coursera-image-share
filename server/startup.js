Meteor.startup(function() {
 if (Images.find().count() === 0) {
   var i = 0;

   for (i = 1; i < 5; i++) {
     Images.insert({
       img_src: 'lambo' + i + '.jpg',
       img_alt: 'Image number ' + i
     });
   }
 }
});