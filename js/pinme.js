var departments = {};
var currentDept=null;

var deptMapName = {};

$(function () {
  $(document).foundation();
  $(document).ready(function(){
    getZones((data) => {
      initZones(data);
      initMap();

      $.getJSON("../PinMeFoundation/department_name_france.json", function(json) {
        deptMapName=json;
      });

      $("#picker").spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        color: '#3d85c6',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ]
      }).change(()=> {
        $("#picker").spectrum("toggle");
      });

      $(".form_container").submit(function(event) {
        event.preventDefault();
        var author = $('input#author').val();
        var content = $('textarea#content').val();
        // console.log('Author='+author+' content='+content);
        createNote(currentDept, author, content, (data) => {
          // console.log('createNote: data='+JSON.stringify(data));
          add_note(data.id,data.author,data.content,data.creation);
          $('textarea#content').val('');
        });
      });

      $("#color_mode").change(() => {
        if(isColorMode()) {
          // console.log('color mode');
          currentDept=null;
          $(".form_container").slideUp('fast');
          $('#notes').empty();
        }
        else {
          // console.log('normal mode');
        }
      });
    });
  });
});

var disableColorMode = () => {
  $("#color_mode").prop('checked', false);
}

var isColorMode = () => {
  return $("#color_mode").is(":checked");
}

var initNotes = (id) => {
  currentDept=id;
  $(".form_container").slideDown('fast');
  $('#notes').empty();
  getNotes(id, (data) => {
    for(var i=0;i<data.length;i++) {
      var itemid=data[i].id;
      add_note(itemid, data[i].author, data[i].content, data[i].creation);
    }
  });
}

var add_note = (item_id, author, content, creation) => {
  var item = ''
  + '<tr>'
  +   '<td class=\'note card callout\' id=\''+item_id+'\' data-closable>'
  +     '<div class="card-divider">'
  +       '#' + item_id + ' ' + author + ' - ' + creation
  +     '</div>'
  +     '<div class="card-section">'
  +       '<p contenteditable="true">'+content+'</p>'
  +       '<div class="actions">'
  +         '<span id="note_log"></span>'
  +       '</div>'
  +     '</div>'
  +     '<button type=\'button\' class=\'close-button\' data-close>'
  +       '<span aria-hidden="true">&times;</span>'
  +     '</button>'
  +   '</td>'
  + '</tr>';
  $('#notes').append(item);

  ((note_id) => {
    $('#'+note_id).find('p').focusout(() => {
      console.log('focusout');
      updateNote(note_id,$('#'+note_id).find('p').html(), (data) => {
        if(data.status==200) {
          // console.log('Successfully updated id='+note_id);
          var log = $('#'+note_id).find('span#note_log');
          log.text('Saved');
          log.stop();
          log.show();
          log.fadeOut( 1000 );
        }
      });
    });

    $('#'+note_id).find('button.close-button').click(() => {
      deleteNote(note_id, (data) => {
        $('#'+note_id).remove();
      });
    });
  })(item_id);
}

var initZones = (data) => {
  for(var i=0;i<data.length;i++) {
    var elem = data[i];
    departments[elem.name] = {
      // value: "42",
      // text: "Coucou",
      tooltip: {
        content: ""
      },
      attrs: {
        fill: elem.color
      },
      eventHandlers: {
        click: function (e, id, mapElem, textElem) {
          if(isColorMode()) {
            changeColor(id);
          }
          else {
            changeStroke(id);
            initNotes(id);
          }
        },
         mouseover: function (e, id, mapElem, textElem, elemOptions) {
           getNotesCount(id, (data) => {
             elemOptions.tooltip.content="<div>"+deptMapName[data.department]+"<br/>Notes: "+data.count+"</div>";
             console.log('tooltip='+JSON.stringify(elemOptions.tooltip));
           });
         }
      }
    };
  }
};

var initMap = () => {
  $(".mapcontainer").mapael({
      map: {
          name: "france_departments",
          defaultArea: {
            tooltip: {
              content: ""
            },
              attrs: {
                  stroke: "#fff",
                  "stroke-width": 0.5
              },
              attrsHover: {
                  "stroke-width": 0.5
              },
              eventHandlers: {
                click: function (e, id, mapElem, textElem) {
                  if(isColorMode()) {
                    changeColor(id);
                  }
                  else {
                    changeStroke(id);
                    initNotes(id);
                  }
                },
                mouseover: function (e, id, mapElem, textElem, elemOptions) {
                  getNotesCount(id, (data) => {
                    elemOptions.tooltip.content="<div>"+deptMapName[data.department]+"<br/>Notes: "+data.count+"</div>";
                  });
                }
              }
          },
          zoom: {
            enabled: true,
            mousewheel: true,
            maxLevel: 30
          }
      },
      areas: departments
  });
};

var changeStroke = (id) => {
  console.log('changeStroke');
  // if(currentDept) {
  //   departments[currentDept] = {
  //     attrs: {
  //       stroke: "#fff",
  //       "stroke-width": 0.5
  //     }
  //   };
  // }
  // departments[id] = {
  //   attrs: {
  //     stroke: "#000000",
  //     "stroke-width": 3
  //   }
  // };
  //
  // var updatedOptions = {
  //   'areas': departments
  // };
  //
  // $(".mapcontainer").trigger('update', [
  //   {
  //     mapOptions: updatedOptions
  //   }
  // ]);
}

var changeColor = (id) => {
  var pickerColor = $("#picker").spectrum('get').toHexString();
  console.log('colorpicked='+pickerColor);
  updateZone(id,pickerColor,(data) => {
    // console.log('Click id='+id+' data='+JSON.stringify(data));
    departments[id] = {
      attrs: {
        fill: pickerColor
      }
    };

    var updatedOptions = {
      'areas': departments
    };

    $(".mapcontainer").trigger('update', [
      {
        mapOptions: updatedOptions
      }
    ]);

    //disableColorMode();

  }, (error) => {
    console.log('Error thrown='+error);
  });
}

var getZones = (success, err) => {
  $.get({
    url: '../PinMeFoundation/getZones.php',
    dataType: 'json',
    success: (data, status) => {
      success(data);
    },
    error: (result, status, error) => {
      console.log('error: result='+result+' status='+status+' error='+error);
      err(error);
    }
  });
}

var updateZone = (name, color, success) => {
  $.post(
    '../PinMeFoundation/updateZone.php',
    {
      name,
      color
    },
    (data) => {
      if(data==200) {
        success(data);
      }
    },
    'text'
  );
}

var getNotes = (id, success, err) => {
  $.get({
    url: '../PinMeFoundation/getNotes.php',
    dataType: 'json',
    data: 'department='+id,
    success: (data, status) => {
      success(data);
    },
    error: (result, status, error) => {
      console.log('error: result='+result+' status='+status+' error='+error);
      err(error);
    }
  });
}

var updateNote = (id, content, success) => {
  $.post(
    '../PinMeFoundation/updateNote.php',
    {
      id,
      content
    },
    (data) => {
      // console.log('data='+data.status);
      if(data.status==200) {
        success(data);
      }
    },
    "json"
  );
}

var createNote = (department, author, content, success) => {
  if(author && content && department) {
    $.post(
      '../PinMeFoundation/updateNote.php',
      {
        department,
        author,
        content
      },
      (data) => {
         console.log('data='+JSON.stringify(data));
         if(data.status==200) {
           success(data.data);
         }
      },
      "json"
    );
  }
}

var deleteNote = (id, success) => {
  $.post(
    '../PinMeFoundation/deleteNote.php',
    {
      id
    },
    (data) => {
      // console.log('data='+JSON.stringify(data));
       if(data.status==200) {
         success(data);
       }
    },
    "json"
  );
}

var getNotesCount = (department, success) => {
  $.get(
    '../PinMeFoundation/countNotes.php',
    {
      department
    },
    (data) => {
      // console.log('getNotesCount: data='+JSON.stringify(data));
      if(data.status==200) {
        success(data.data);
      }
    },
    "json"
  );
}
