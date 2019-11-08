const moment = require('moment');

module.exports = {
    formatDate: function(date, format){
        return moment(date).format(format);
      },
      select: function(selected, options){
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
      },
      editIcon: function(phoneUser, loggedUser, phoneId, floating = true){
        if(phoneUser == loggedUser){
          if(floating){
            return `<a href="/phones/edit/${phoneId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
          } else {
            return `<a href="/phones/edit/${phoneId}"><i class="fa fa-pencil"></i></a>`;
          }
        } else {
          return '';
        }
      }
      
}