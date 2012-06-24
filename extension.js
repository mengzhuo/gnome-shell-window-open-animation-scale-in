const Meta = imports.gi.Meta;
const Lang = imports.lang;
const Tweener = imports.ui.tweener;
const Extension = imports.misc.extensionUtils;
const ExtensionLists = Extension.extensions;

const WINDOW_ANIMATION_TIME = 0.20;

const ScaleInForWindow = new Lang.Class({
    Name: "ScaleInForWindow",
    
    _init: function (){
        
        let display = global.screen.get_display();
        
        display.connect('window-created', Lang.bind(this, this._scaleIn));

        global._scale_in_aminator = this;
        
        this._screenW = global.screen_width;
        this._screenH = global.screen_height;
        
    },
    _scaleIn : function (display,window){
        
        if (!window.maximized_horizontally && window.get_window_type() == Meta.WindowType.NORMAL){
        
            let actor = window.get_compositor_private();
            
            let [width,height] = actor.get_size();
            
            // Initialized scale 
            scale_x = Math.min(1-(this._screenW - width)/this._screenW,0.85);
            scale_y = Math.min(1-(this._screenH - height)/this._screenH,0.85);
            actor.set_scale(scale_x,scale_y);
            
            
            Tweener.addTween(actor,{
                             scale_x:1,
                             scale_y:1,
                             time: WINDOW_ANIMATION_TIME,
                             transition: 'easeOutQuad'
                            });
        };
    }
});

let scalemaker = null;
let metadata = null;

function enable() {
    // check conflict extension
    for  (var extension in ExtensionLists){
        if (extension.state == 1){ // WORKAROUND:I can't found enum of extension state
            for (var conflict in metadata.conflict-uuid){
                if (extension.uuid == conflict){
                    throw new Error('%s conflict with %s'.format(metadata.uuid,conflict));
                    return false;
                }
            }
        } 
    }
    
    if (scalemaker == null){
        scalemaker = new ScaleInForWindow();
    }
}
function disable() {
    if (scalemaker != null){
        scalemaker.destroy();
        scalemaker = null;
    }
}
function init(metadataSource) {
    metadata = metadataSource;

}
