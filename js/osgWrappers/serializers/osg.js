/** -*- compile-command: "jslint-cli osg.js" -*-
 *
 *  Copyright (C) 2010-2011 Cedric Pinson
 *
 *                  GNU LESSER GENERAL PUBLIC LICENSE
 *                      Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 *
 * This version of the GNU Lesser General Public License incorporates
 * the terms and conditions of version 3 of the GNU General Public
 * License
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.com>
 *
 */

osgDB.ObjectWrapper.serializers.osg = {};

osgDB.ObjectWrapper.serializers.osg.Object = function(jsonObj, obj) {
    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return false;
    }
    
    if (jsonObj.Name) {
        obj.setName(jsonObj.Name);
    }
    return true;
};

osgDB.ObjectWrapper.serializers.osg.Node = function(jsonObj, node) {
    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, node);

    if (jsonObj.UpdateCallbacks) {
        for (var j = 0, l = jsonObj.UpdateCallbacks.length; j < l; j++) {
            var cb = osgDB.ObjectWrapper.readObject(jsonObj.UpdateCallbacks[j]);
            if (cb) {
                node.addUpdateCallback(cb);
            }
        }
    }

    if (jsonObj.StateSet) {
        node.setStateSet(osgDB.ObjectWrapper.readObject(jsonObj.StateSet));
    }
    
    if (jsonObj.Children) {
        for (var i = 0, k = jsonObj.Children.length; i < k; i++) {
            var obj = osgDB.ObjectWrapper.readObject(jsonObj.Children[i]);
            if (obj) {
                node.addChild(obj);
            }
        }
    }
};

osgDB.ObjectWrapper.serializers.osg.StateSet = function(jsonObj, stateSet) {
    var check = function(o) {
        return true;
    };

    if (!check(jsonObj)) {
        return;
    }
    
    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, stateSet);

    if (jsonObj.RenderingHint !== undefined) {
        stateSet.setRenderingHint(jsonObj.RenderingHint);
    }

    if (jsonObj.AttributeList !== undefined) {
        for (var i = 0, l = jsonObj.AttributeList.length; i < l; i++) {
            var attr = osgDB.ObjectWrapper.readObject(jsonObj.AttributeList[i]);
            if (attr !== undefined) {
                stateSet.setAttributeAndMode(attr);
            }
        }
    }

    if (jsonObj.TextureAttributeList) {
        var textures = jsonObj.TextureAttributeList;
        for (var t = 0, lt = textures.length; t < lt; t++) {
            var textureAttributes = textures[t];
            for (var a = 0, al = textureAttributes.length; a < al; a++) {
                var tattr = osgDB.ObjectWrapper.readObject(textureAttributes[a]);
                if (tattr)
                    stateSet.setTextureAttributeAndMode(t, tattr);
            }
        }
    }

};

osgDB.ObjectWrapper.serializers.osg.Material = function(jsonObj, material) {
    var check = function(o) {
        if (o.Diffuse !== undefined && 
            o.Emission !== undefined && 
            o.Specular !== undefined && 
            o.Shininess !== undefined) {
            return true;
        }
        return false;
    };

    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, material);

    material.setAmbient(jsonObj.Ambient);
    material.setDiffuse(jsonObj.Diffuse);
    material.setEmission(jsonObj.Emission);
    material.setSpecular(jsonObj.Specular);
    material.setShininess(jsonObj.Shininess);
};


osgDB.ObjectWrapper.serializers.osg.BlendFunc = function(jsonObj, blend) {
    var check = function(o) {
        if (o.SourceRGB && o.SourceAlpha && o.DestinationRGB && o.DestinationAlpha) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, blend);

    blend.setSourceRGB(jsonObj.SourceRGB);
    blend.setSourceAlpha(jsonObj.SourceAlpha);
    blend.setDestinationRGB(jsonObj.DestinationRGB);
    blend.setDestinationAlpha(jsonObj.DestinationAlpha);
};

osgDB.ObjectWrapper.serializers.osg.CullFace = function(jsonObj, attr) {
    var check = function(o) {
        if (o.Mode !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, attr);

    attr.setMode(jsonObj.Mode);
};

osgDB.ObjectWrapper.serializers.osg.BlendColor = function(jsonObj, attr) {
    var check = function(o) {
        if (o.ConstantColor !== undefined) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, attr);

    attr.setConstantColor(jsonObj.ConstantColor);
};

osgDB.ObjectWrapper.serializers.osg.Light = function(jsonObj, light) {
    var check = function(o) {
        if (o.LightNum !== undefined &&
            o.Ambient !== undefined &&
            o.Diffuse !== undefined &&
            o.Direction !== undefined &&
            o.Position !== undefined &&
            o.Specular !== undefined &&
            o.SpotCutoff !== undefined &&
            o.LinearAttenuation !== undefined &&
            o.ConstantAttenuation !== undefined &&
            o.QuadraticAttenuation !== undefined ) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, light);
    light.setAmbient(jsonObj.Ambient);
    light.setConstantAttenuation(jsonObj.ConstantAttenuation);
    light.setDiffuse(jsonObj.Diffuse);
    light.setDirection(jsonObj.Direction);
    light.setLightNumber(jsonObj.LightNum);
    light.setLinearAttenuation(jsonObj.LinearAttenuation);
    light.setPosition(jsonObj.Position);
    light.setQuadraticAttenuation(jsonObj.QuadraticAttenuation);
    light.setSpecular(jsonObj.Specular);
    light.setSpotCutoff(jsonObj.SpotCutoff);
    light.setSpotBlend(0.01);
    if (jsonObj.SpotExponent !== undefined) {
        light.setSpotBlend(jsonObj.SpotExponent/128.0);
    }
};

osgDB.ObjectWrapper.serializers.osg.Texture = function(jsonObj, texture) {
    var check = function(o) {
        return true;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Object(jsonObj, texture);

    if (jsonObj.MinFilter) {
        texture.setMinFilter(jsonObj.MinFilter);
    }
    if (jsonObj.MagFilter) {
        texture.setMagFilter(jsonObj.MagFilter);
    }

    if (jsonObj.WrapT) {
        texture.setWrapT(jsonObj.WrapT);
    }
    if (jsonObj.WrapS) {
        texture.setWrapS(jsonObj.WrapS);
    }

    if (jsonObj.File) {
        var img = osgDB.readImage(jsonObj.File);
        texture.setImage(img);
    }
};


osgDB.ObjectWrapper.serializers.osg.Projection = function(jsonObj, node) {
    var check = function(o) {
        if (o.Matrix) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Node(jsonObj, node);

    if (jsonObj.Matrix) {
        node.setMatrix(jsonObj.Matrix);
    }

};


osgDB.ObjectWrapper.serializers.osg.MatrixTransform = function(jsonObj, node) {
    var check = function(o) {
        if (o.Matrix) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Node(jsonObj, node);

    if (jsonObj.Matrix) {
        node.setMatrix(jsonObj.Matrix);
    }
};


osgDB.ObjectWrapper.serializers.osg.LightSource = function(jsonObj, node) {
    var check = function(o) {
        if (o.Light) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Node(jsonObj, node);
    var light = osgDB.ObjectWrapper.readObject(jsonObj.Light);
    node.setLight(light);
};


osgDB.ObjectWrapper.serializers.osg.Geometry = function(jsonObj, node) {
    var check = function(o) {
        if (o.PrimitiveSetList && o.VertexAttributeList) {
            return true;
        }
        return false;
    };
    if (!check(jsonObj)) {
        return;
    }

    osgDB.ObjectWrapper.serializers.osg.Node(jsonObj, node);

    var mode, first, count, array;
    for (var i = 0, l = jsonObj.PrimitiveSetList.length; i < l; i++) {
        var entry = jsonObj.PrimitiveSetList[i];
        
        var drawElementPrimitive = entry.DrawElementUShort || entry.DrawElementUByte || entry.DrawElementUInt || entry.DrawElementsUShort || entry.DrawElementsUByte || entry.DrawElementsUInt || undefined;
        if ( drawElementPrimitive ) {
            var jsonArray = drawElementPrimitive.Indices;
            mode = drawElementPrimitive.Mode;
            array = new osg.BufferArray(osg.BufferArray[jsonArray.Type], 
                                            jsonArray.Elements, 
                                            jsonArray.ItemSize );
            if (!mode) {
                mode = osg.PrimitiveSet.TRIANGLES;
            } else {
                mode = osg.PrimitiveSet[mode];
            }
            var drawElements = new osg.DrawElements(mode, array);
            node.getPrimitiveSetList().push(drawElements);
        }

        var drawArrayPrimitive = entry.DrawArray || entry.DrawArrays;
        if (drawArrayPrimitive) {

            mode = drawArrayPrimitive.Mode || drawArrayPrimitive.mode;
            first = drawArrayPrimitive.First !== undefined ? drawArrayPrimitive.First : drawArrayPrimitive.first;
            count = drawArrayPrimitive.Count !== undefined ? drawArrayPrimitive.Count : drawArrayPrimitive.count;
            var drawArray = new osg.DrawArrays(osg.PrimitiveSet[mode], first, count);
            node.getPrimitives().push(drawArray);

        }

        var drawArrayLengthsPrimitive = entry.DrawArrayLengths || undefined;
        if (drawArrayLengthsPrimitive) {
            mode = drawArrayLengthsPrimitive.Mode;
            first = drawArrayLengthsPrimitive.First;
            array = drawArrayLengthsPrimitive.ArrayLengths;
            var drawArrayLengths =  new osg.DrawArrayLengths(osg.PrimitiveSet[mode], first, array);
            node.getPrimitives().push(drawArrayLengths);
        }
    }
    for (var key in jsonObj.VertexAttributeList) {
        if (jsonObj.VertexAttributeList.hasOwnProperty(key)) {
            var attributeArray = jsonObj.VertexAttributeList[key];
            node.getVertexAttributeList()[key] = new osg.BufferArray(osg.BufferArray[attributeArray.Type], attributeArray.Elements, attributeArray.ItemSize );
        }
    }
};