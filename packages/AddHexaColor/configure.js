function configure(packageFolder, packageName)
{
  if (about.isPaintMode())
    return;

  //---------------------------
  //Create Shortcuts
  ScriptManager.addShortcut( { id       : "AddHexacolour",
                               text     : "Add Hexa colour",
                               action   : "AddHexacolour in ./configure.js",
                               longDesc : "Create a new color with an hexadecimal string",
                               order    : "256",
                               categoryId   : "Custom", 
                               categoryText : "Scripts" } );
                               
							   
  //---------------------------
  //Create Menu items
  ScriptManager.addMenuItem( { targetMenuId : "INSERT_MENU_ID",
                               id           : "Add Hexa colour",
                               text         : "Add Hexa colour",
                               action       : "AddHexacolour in ./configure.js",
                               shortcut     : "AddHexacolour" } );
                               

  
  
  //---------------------------
  //Create Toolbar
  var AddHexaToolbar = new ScriptToolbarDef( { id          : "AddHexaToolbar",
                                                    text        : "Hexa",
                                                    customizable: "false" } );
  
  AddHexaToolbar.addButton( { text   : "Add Hexa colour",
                                   icon   : "hashTag.png",
                                   action : "AddHexacolour in ./configure.js",
                                   shortcut : "AddHexacolour" } );
  
  
  ScriptManager.addToolbar(AddHexaToolbar);
}

//Optional init function (not mandatory)
function init()
{
	var coulr;
	var coulg;
	var coulb;
}



function createWidget(){
	
	
	
	var own = new QWidget();
	own.focusPolicy = Qt.StrongFocus;

	var gridLayout = new QVBoxLayout(own);
	gridLayout.objectName = "gridLayout";

	var editionLayout = new QVBoxLayout(gridLayout);
	editionLayout.objectName = "editionLayout";

	var hexaLayout = new QVBoxLayout(editionLayout);
	hexaLayout.objectName = "hexaLayout";

	var RGBLayout = new QHBoxLayout(editionLayout);
	RGBLayout.objectName = "RGBLayout";

	var buttonsLayout = new QHBoxLayout(gridLayout);
	buttonsLayout.objectName = "buttonsLayout";
	
	own.gridLayout.addLayout(editionLayout,1);
	own.gridLayout.editionLayout.addLayout(hexaLayout,1);
	own.gridLayout.editionLayout.addLayout(RGBLayout,1);
	own.gridLayout.addLayout(buttonsLayout,1);

	own.mouseTracking = true;	
	//Return the QWidget itself
	return own;

}



function AddHexacolour(){
// Populating the window
	//Create the QWidget
	var myUi = createWidget();
	myUi.setWindowFlags(Qt.FramelessWindowHint);
	myUi.setWindowFlags(Qt.Popup);

	//Create the Label
	var instruction = new QLabel();
	myUi.gridLayout.editionLayout.hexaLayout.addWidget(instruction,0,0);
	instruction.text = "Enter an Hexadecimal value : ♯";
	

	//Create the LineEdit
	var HexaValue = new QLineEdit();
	myUi.gridLayout.editionLayout.hexaLayout.addWidget(HexaValue, 1, 0);
	HexaValue.maxLength = 6;
	
	//Create the Previewer
	var Previewer = new QLabel();
	myUi.gridLayout.editionLayout.hexaLayout.addWidget(Previewer, 2, 0);
	Previewer.setProperty("selected", false);
	Previewer.setFixedSize(400,120);
	Previewer.setStyleSheet('QLabel{border-style: solid; border-width: 3px; border-radius:5px ; border-color:black ;}');

	var RValue = new QLabel();
	myUi.gridLayout.editionLayout.RGBLayout.addWidget(RValue,1,1);
	RValue.text = "R : ";

	var GValue = new QLabel();
	myUi.gridLayout.editionLayout.RGBLayout.addWidget(GValue,1,1);
	GValue.text = "G : ";

	var BValue = new QLabel();
	myUi.gridLayout.editionLayout.RGBLayout.addWidget(BValue,1,1);
	BValue.text = "B : ";

	


	//Create the Label for the name of the color
	var setColorName = new QLabel();
	myUi.gridLayout.editionLayout.addWidget(setColorName,4,0);
	setColorName.text = "Type your color name :";
	
	//Create the LineEdit
	var colorName = new QLineEdit();
	myUi.gridLayout.editionLayout.addWidget(colorName, 5, 0);

///////////////////////////////////////////////////////////////////////////////////
	//Create butons to create the color or to cancel

	var OK = new QToolButton();
	myUi.gridLayout.buttonsLayout.addWidget(OK, 3, 0);
	OK.text = "Create";

	var CANCEL = new QToolButton();
	myUi.gridLayout.buttonsLayout.addWidget(CANCEL, 3, 1);
	CANCEL.text = "Cancel";

	//Functions


	this.Colorize = function(){
		

		if (HexaValue.text.length == 6){

			var couleur= HexaValue.text;

			coulr=Number("0x"+couleur.substr(0,2));
			coulg=Number("0x"+couleur.substr(2,2));
			coulb=Number("0x"+couleur.substr(4,2));

			//Display RGB values

			RValue.text = "R : " + coulr;
			GValue.text = "G : " + coulg;
			BValue.text = "B : " + coulb;

			
			Previewer.setStyleSheet('QLabel{border-style: solid; border-width: 3px; border-radius:5px ; border-color:black ; background-color: rgba('+coulr+','+coulg+','+coulb+',255);}QLabel[selected="true"]{border-color:rgba(34,202,227,255);}QLabel[selected="false"]{border-color:black;}');

		}

	}

	this.CreateColor = function(coulr,coulg,coulb){

		scene.beginUndoRedoAccum ("Create Gradient Color");

		var currentPaletteName = PaletteManager.getCurrentPaletteName();
		var currentPaletteID = PaletteManager.getCurrentPaletteId();
		var scenePalette = PaletteObjectManager.getScenePaletteList();
		var myPalette = scenePalette.getPaletteById(currentPaletteID);
		var palettPath = scenePalette.getPath();
		myPalette.setToColorPalette();
		var colorType = PaletteObjectManager.Constants.ColorType.SOLID_COLOR;

		myPalette.createNewColor(colorType, colorName.text, { r : this.coulr, g: this.coulg, b: this.coulb, a : 255 });





		scene.endUndoRedoAccum();

	}


	this.cancel = function(){

		myUi.close();	

	}

	// Connect functions
	HexaValue.textChanged.connect(this, this.Colorize);
	OK.clicked.connect(this, this.CreateColor);
	CANCEL.clicked.connect(this, this.cancel);

	//Show the Ui
	myUi.show();



}

exports.configure = configure;
exports.init = init;
