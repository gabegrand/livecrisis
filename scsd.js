Updates = new Mongo.Collection("updates");

if (Meteor.isClient) {
    // Helpers
    Template.body.helpers({
        updates: function () {
            return Updates.find({}, {sort: {timestamp: -1}});
        }
    });
    
    Template.update.helpers({
        prettifyDate: function(timestamp) {
            if (Math.abs(moment().diff(timestamp)) < 60000) // 60 seconds before or after now
            {
                return "just now";

            }

            // Else returns formatted timestamp
            else
            {
                return moment(timestamp).fromNow();
            }
        }
    });
    
    // Events
    Template.body.events({
        "submit .new-update": function (event) {
            var text = event.target.text.value;
            var prof_img = event.target.prof_img.value;
            console.log(prof_img);

            Updates.insert({
                text: text,
                prof_img: prof_img,
                timestamp: new Date() // current time
            });

            // Clear form
            event.target.text.value = "";
            
            // Play sound
            document.getElementById('chime').play();

            // Prevent default form submit
            return false;
        }
    });
    
    Template.update.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Updates.update(this._id, {$set: {checked: ! this.checked}});
        },
        
        "click .delete": function () {
            Updates.remove(this._id);
        }
    });
    
    // Config
    Accounts.config({
        forbidClientAccountCreation: true
    });
    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}