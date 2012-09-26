$(function () {

    var oneTask = Backbone.Model.extend({

        defaults: {
           title: "",
           done: false,
           order: ""

        }
    });

    var oneTaskView =   Backbone.View.extend({

        template: _.template($('#item-template').html()),

        initialize : function () {
            this.model.bind("change:title", this.render, this);
            this.model.bind("change:done", this.render, this);
            this.model.trigger("change:title");
        },

        tagName:  "li",


        events: {

            "dblclick .view" : "edit",
            "keypress input:text":  "saveOnEnter",
            "click input:checkbox": "done",
            "mouseover .view" : "showIm",
            "mouseout .view" : "hideIm",
            "click #moveDown" : "moveDown",
            "click #moveUp " : "moveUp",
            "click #destroy" : "destroy"

        },

        edit: function() {
            this.$(".edit").val(this.model.get('title'));
            this.$(".view").hide();
            this.$(".edit").show();
        },

        saveOnEnter: function (e) {
            if (e.keyCode != 13) {
                return;
            } ;
            this.model.set({title: this.$('.edit').val()});
            if (this.$('.edit').val() == '') {
                this.remove();

            }
    },
/*кукукууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу*/
        done: function () {
            if ( this.$el.find("input:checkbox").prop("checked") == true)
            this.model.set({done : true})
            else
            this.model.set({done : false}) 
        },

        showIm: function () {
            this.$(".img").show();
        },
        hideIm: function () {
            this.$(".img").hide();
        },

        moveDown: function () {
            if ((this.model.get("order") - 1) < 0) return;
            var temp ={
                title : TodoListOBJ.at(this.model.get("order")).get("title"),
                done :   TodoListOBJ.at(this.model.get("order")).get("done")
            }

            TodoListOBJ.at(this.model.get("order")).set({
                title : TodoListOBJ.at(this.model.get("order") - 1 ).get("title"),
                done :  TodoListOBJ.at(this.model.get("order") -1 ).get("done")
            });
            TodoListOBJ.at(this.model.get("order") -1 ).set(temp);
        },

        moveUp: function () {
            if ((this.model.get("order") + 1) >= TodoListOBJ.length) return;
                        var temp ={
                title : TodoListOBJ.at(this.model.get("order")).get("title"),
                done :   TodoListOBJ.at(this.model.get("order")).get("done")
            }

            TodoListOBJ.at(this.model.get("order")).set({
                title : TodoListOBJ.at(this.model.get("order") + 1 ).get("title"),
                done :  TodoListOBJ.at(this.model.get("order") +1 ).get("done")
            });
            TodoListOBJ.at(this.model.get("order") +1 ).set(temp);
        },

        destroy: function () {
            this.remove();
            this.model.destroy();
            var i=0;
            _.each(TodoListOBJ.models, function(num){
                    num.set({order : i++})
                }
            )   
        },

        render: function () {

            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            return this.$el;
        }

    });



    


    var TodoList = Backbone.Collection.extend({

        model: oneTask,

        nextOrder: function () {
            if (!this.length) return 0;
            return this.last().get('order') + 1;
        },
    });

    






    var ProjectView = Backbone.View.extend({

        template: _.template($('#project-template').html()),

        initialize: function(projName, elem) {
            this.collection = new  TodoList();
            this.collection.bind("add", this.addOne, this);
            $("#todoapp").append( this.render(projName) );
        },

       //el : $("#todoapp"),

        events: {

            "keypress input:text":  "createOnEnter",


        },

         tagName: "span",


        addOne: function (oneTask) {
            var view = new oneTaskView({model : oneTask});
            this.$el.append(view.render());
        },

        createOnEnter: function (e) {
            if (e.keyCode != 13) return;

            this.collection.push({
                title : this.$el.find('input:text').val(),
                done : this.$el.find('input:checkbox').prop("checked"),
                order: this.collection.nextOrder()
            });
            this.$el.find('input:text').val('');
        },

        

        render: function (f) {
                this.$el.html(this.template(f));
                return this.$el;
        }



    });


    var AppView = Backbone.View.extend({

        initialize: function() {
           
        },

        el : $("#todoapp"),

        events: {
            "keypress #new-todo":  "projectAdd",
        },

        projectAdd: function (e) {
            if (e.keyCode != 13) return;
            var ProjectViewOBJ = new ProjectView({project : this.$el.find(" #new-todo ").val() });
            this.$el.find("#new-todo").val('');
        }



    });

    var AppViewOBJ = new AppView();
   
});