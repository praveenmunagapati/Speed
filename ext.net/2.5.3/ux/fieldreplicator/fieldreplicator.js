/*
 * @version   : 2.5.3 - Ext.NET Pro License
 * @author    : Ext.NET, Inc. http://www.ext.net/
 * @date      : 2014-10-30
 * @copyright : Copyright (c) 2008-2014, Ext.NET, Inc. (http://www.ext.net/). All rights reserved.
 * @license   : See license.txt and http://www.ext.net/license/.
 */


Ext.define('Ext.ux.FieldReplicator',{singleton:true,init:function(field){if(!field.replicatorId){field.replicatorId=Ext.id();}
field.on('blur',this.onBlur,this);},onBlur:function(field){var ownerCt=field.ownerCt,replicatorId=field.replicatorId,isEmpty=Ext.isEmpty(field.getRawValue()),siblings=ownerCt.query('[replicatorId='+replicatorId+']'),isLastInGroup=siblings[siblings.length-1]===field,clone,idx;if(isEmpty&&!isLastInGroup){Ext.Function.defer(field.destroy,10,field);}
else if(!isEmpty&&isLastInGroup){if(field.onReplicate){field.onReplicate();}
clone=field.cloneConfig({replicatorId:replicatorId});idx=ownerCt.items.indexOf(field);ownerCt.add(idx+1,clone);}}});
