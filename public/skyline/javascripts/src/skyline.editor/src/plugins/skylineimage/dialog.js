Skyline.Editor.plugins.SkylineImage.Dialog = new Class({
  validAttributes : {
    "skyline-ref-id": "ref_id",
    "skyline-referable-id" : "referable_id",
    "skyline-referable-type" : "referable_type",
    "alt" : "alt",
    "class" : "class",
    "src" : "url",
    "width" : "width",
    "height" : "height"
  },
  initialize : function(ed){
    this.url = ed.settings.skyline_image_dialog_url
    this.editor = ed;
    this.editorImageEl = ed.selection.getNode();
    this.bookmark = ed.selection.getBookmark('simple');
    if(this.editorImageEl.nodeName == 'IMG'){
      this.edit = true;
    }
    
    this.dialog = new Application.ImageBrowser($merge(this._getParameters(this.editorImageEl),{common:true}));
    this.dialog.addEvent("select", this.insert.bind(this));
    this.dialog.addEvent("cancel", this.cancel.bind(this));
    this.dialog.open();
  },
  cancel : function(){
    this.editor.getWin().focus();
  },
  insert : function(values){
		var ed = this.editor, t = this, el = this.editorImageEl, attr;
		
		attr = this._getAttributes(values);
    styles = {};
    
		// Fixes crash in Safari
		if (tinymce.isWebKit){
			ed.getWin().focus();
		}
		
		if (attr.src && attr.src === '' || !attr.src) {
			if (el.nodeName == 'IMG') {
				ed.dom.remove(el);
				ed.execCommand('mceRepaint');
			}
			ed.getWin().focus();
			return;
		}

    this._restoreSelection();
		if (el && el.nodeName == 'IMG') {
			ed.dom.setAttribs(el, attr);
		} else {
			ed.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo : 1});
			el = ed.dom.get('__mce_tmp');
			ed.dom.setAttribs(el, attr);
			ed.dom.setAttrib(el, 'id', '');
			ed.undoManager.add();
		}
		
    // Force a resize so we should not have resize artifacts.
		ed.execCommand('mceAutoResize',false);		
		ed.getWin().focus();
  },

  // Get attributes from IMG tag for passing to dialog
  _getParameters : function(el){
    if(!this.edit){ return {"new": true}; }
    var attr = {"new": false}, el = $(el);
    $H(this.validAttributes).each(function(v,k){
      attr[v] = el.getProperty(k);
    });
    return attr
  },
  // Get attributes from dialog for IMG tag
  _getAttributes : function(values){
    var attr = {};
    $H(this.validAttributes).each(function(v,k){
      attr[k] = values[v];
    });    
    return attr;
  },
  _restoreSelection : function(){
		if (tinymce.isIE){
			this.editor.selection.moveToBookmark(this.bookmark);
		}
    
  }
});