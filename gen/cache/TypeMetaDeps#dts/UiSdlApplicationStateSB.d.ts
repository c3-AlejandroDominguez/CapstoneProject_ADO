// TypeScript definitions for the C3 type UiSdlApplicationStateSB

/**
 * @remarks this represents a value passed to a method that expects an instance of UiSdlApplicationStateSB
 */
declare interface IUiSdlApplicationStateSB {

  /**
   * Various system fields.
   */
  meta?: IMeta;

  /**
   * Unique identifier for the logical object that instance of this type represents.
   */
  id?: string;

  /**
   * The name of the component. Optional field for informational purposes only.
   */
  name?: string;

  /**
   * The data settings for this component.
   *
   * @uiSdlDesignerCustomRenderer(rendererType='')
   */
  dataSpec?: IUiSdlNoData;

  /**
   * Disable if you want to avoid sending any and all requests for this component on first render.
   */
  disableDataRequestOnFirstRender?: boolean;

  /**
   * Whether the effect triggers and epics have been registered
   */
  triggersRegistered?: boolean;

  /**
   * Whether to wrap the component with a div which has a class name of its metdata id. Useful for targeting with css.
   */
  wrapWithMetadataId?: boolean;

  /**
   * The Redux namespace for the application state to indicate where the application data is stored in the Redux state.
   */
  REDUX_NAMESPACE?: string;

  /**
   * Collection of extra async {@link UiSdlEffectTrigger}.
   */
  effectTriggers?: Array_Type<UiSdlEffectTrigger> | Array<IUiSdlEffectTrigger>;

  rowRecord?: any;
}

/**
 * @remarks this represents a made instance of UiSdlApplicationStateSB
 */
declare class UiSdlApplicationStateSB extends Obj  {

  /**
   * Various system fields.
   */
  readonly meta?: Meta;
  withMeta(meta: IMeta | null): UiSdlApplicationStateSB;

  /**
   * Unique identifier for the logical object that instance of this type represents.
   */
  readonly id?: string;
  withId(id: string | null): UiSdlApplicationStateSB;

  /**
   * The name of the component. Optional field for informational purposes only.
   */
  readonly name?: string;
  withName(name: string | null): UiSdlApplicationStateSB;

  /**
   * The data settings for this component.
   *
   * @uiSdlDesignerCustomRenderer(rendererType='')
   */
  readonly dataSpec?: UiSdlNoData;
  withDataSpec(dataSpec: IUiSdlNoData | null): UiSdlApplicationStateSB;

  /**
   * Disable if you want to avoid sending any and all requests for this component on first render.
   */
  readonly disableDataRequestOnFirstRender?: boolean;
  withDisableDataRequestOnFirstRender(disableDataRequestOnFirstRender: boolean): UiSdlApplicationStateSB;

  /**
   * Whether the effect triggers and epics have been registered
   */
  readonly triggersRegistered?: boolean;
  withTriggersRegistered(triggersRegistered: boolean): UiSdlApplicationStateSB;

  /**
   * Whether to wrap the component with a div which has a class name of its metdata id. Useful for targeting with css.
   */
  readonly wrapWithMetadataId?: boolean;
  withWrapWithMetadataId(wrapWithMetadataId: boolean): UiSdlApplicationStateSB;

  /**
   * The Redux namespace for the application state to indicate where the application data is stored in the Redux state.
   */
  readonly REDUX_NAMESPACE?: string;
  withREDUX_NAMESPACE(REDUX_NAMESPACE: string | null): UiSdlApplicationStateSB;

  /**
   * Collection of extra async {@link UiSdlEffectTrigger}.
   */
  readonly effectTriggers?: Array_Type<UiSdlEffectTrigger>;
  withEffectTriggers(effectTriggers: Array_Type<UiSdlEffectTrigger> | Array<IUiSdlEffectTrigger> | null): UiSdlApplicationStateSB;

  readonly rowRecord?: any;
  withRowRecord(rowRecord: any | null): UiSdlApplicationStateSB;

  /**
   * Load the JSON-based representation and reconstruct the corresponding object.
   *
   * fromJson is be called on the type be deserialized and must reconstruct an Obj of the appropriate type (which may be
   * a type that mixes in the type on which it is called). This means that the resulting object's type will be isA the
   * called-on type, but perhaps not identical. In particular, `Obj.fromJson` works for any actual type and will return
   * an instance of the correct type.
   *
   * @see #toJson
   */
  static fromJson(json: any): UiSdlApplicationStateSB | null;

  /**
   * Load the JSON-based representation and reconstruct the corresponding object.
   *
   * fromJsonString is be called on the type be deserialized and must reconstruct an Obj of the appropriate type (which may be
   * a type that mixes in the type on which it is called). This means that the resulting object's type will be isA the
   * called-on type, but perhaps not identical. In particular, `Obj.fromJsonString` works for any actual type and will return
   * an instance of the correct type.
   *
   * @see #toJsonString
   */
  static fromJsonString(json: string): UiSdlApplicationStateSB | null;

  /**
   * Load the XML-based representation and reconstruct the corresponding object.
   *
   * fromXmlString is be called on the type be deserialized and must reconstruct an Obj of the appropriate type (which
   * may be a type that mixes in the type on which it is called). This means that the resulting object's type will be
   * isA the called type, but perhaps not identical. In particular, `Obj.fromXmlString` works for any actual type and
   * will return an instance of the correct type.
   *
   * @see #toXmlString
   */
  static fromXmlString(xml: string): UiSdlApplicationStateSB | null;

  /**
   * Load from contentType representation and reconstruct the corresponding object.
   *
   * fromString is be called on the type be deserialized and must reconstruct an object of the appropriate type
   * (which may be a type that mixes in the type on which it is called). This means that the resulting object's type
   * will be isA the called-on type, but perhaps not identical. In particular, `fromString` works for any actual
   * type and will return an instance of the correct type.
   */
  static deserialize(contentStr: string, contentType: string): UiSdlApplicationStateSB | null;

  /**
   * Returns new instance with all references to old type, including result of #type, replaced with new type. If new
   * type does not contain fields from old or field value types are not convertable then drops the field.
   *
   * This method is used during live metadata update
   */
  replaceType(old: Type, new_: Type): UiSdlApplicationStateSB;

  /**
   * Result of this function call is a copy of current instance with all non empty fields replaced based on results of
   * the `mapper` invocation.
   *
   * @param action
   *           lambda to apply for every field value to produce a new value for that field
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapFieldValues(mapper: λBiFunction<FieldType, any, any | null>, convertValue?: boolean): UiSdlApplicationStateSB;

  /**
   * Result of this function call is a copy of current instance with all fields replaced based on results of the
   * `mapper` invocation.
   *
   * @param spec
   *           which fields to include
   * @param mapper
   *           lambda to apply for every field value to produce a new value for that field
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapFieldValues(spec: ValueSpec, mapper: λBiFunction<FieldType, any, any | null>, convertValue?: boolean): UiSdlApplicationStateSB;

  /**
   * Result of this function call is a copy of current instance with all non empty fields replaced based on results of
   * the asynchronous `mapper` invocation.
   *
   * @param action
   *           lambda to apply for every field value to produce a new value for that fields
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapFieldValuesAsync(mapper: λBiFunction<FieldType, any, Promise<any> | null>, convertValue?: boolean): Promise<UiSdlApplicationStateSB>;

  /**
   * Result of this function call is a copy of current instance with all fields replaced based on results of the
   * asynchronous `mapper` invocation.
   *
   * @param spec
   *           which fields to include
   * @param mapper
   *           lambda to apply for every field value to produce a new value for that field
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapFieldValuesAsync(spec: ValueSpec, mapper: λBiFunction<FieldType | null, any, Promise<any> | null>, convertValue?: boolean): Promise<UiSdlApplicationStateSB>;

  /**
   * Result of this function call is a copy of current instance with specified field value replaced based on result of
   * the `mapper` invocation.
   * @param field
   *           field being mapped
   * @param includeEmpty
   *           if set, invokes mapper for fields with empty value
   * @param mapper
   *           lambda to apply for every field value to produce a new value for that field
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapFieldValue(field?: FieldType, includeEmpty?: boolean, mapper: λFunction<any, any | null>, convertValue?: boolean): UiSdlApplicationStateSB;

  /**
   * Executes the specified lambda against each referenced Obj instance and replaces it's value with result of this
   * lambda application.
   *
   * Result of this function call is a copy of current instance with all references replaced based on results of the
   * `mapper` invocation.
   *
   * @param action
   *           function to be executed for each pair of field type and Obj instance
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapRefs(mapper: λBiFunction<FieldType, Obj, Obj | null>, convertValue?: boolean): UiSdlApplicationStateSB;

  /**
   * Executes the specified lambda against each referenced Obj instance and replaces it's value with result of this
   * lambda application.
   *
   * Result of this function call is a copy of current instance with all references replaced based on results of the
   * `mapper` invocation.
   *
   * @param includeEmpty
   *           if `true` will also process references with `null` / "Empty" references
   * @param mapper
   *           function to be executed for each pair of field type and Obj instance for producing new reference value
   * @param convertValue
   *           if true, attempt to convert the value to match the field's type
   */
  mapRefs(includeEmpty: boolean, mapper: λBiFunction<FieldType, Obj, Obj | null>, convertValue?: boolean): UiSdlApplicationStateSB;

  /**
   * Populates all missing default values and throws error if any constraint is violated.
   */
  validateObj(): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj instance by adding the provided field in it. The name must correspond to an existing field
   * defined on this type or its mixins. The value must be of the correct type if doNotConvert flag is true.
   *
   * @param field
   *           name of the field
   * @param value
   *           of the field
   * @param doNotConvert
   *           if true, do not attempt to convert the value to match the field's type
   * @return new Obj
   *
   * @see #withoutField
   * @see #defaultField
   */
  withField(field: string, value: any, doNotConvert?: boolean): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj instance by adding the provided field in it. The name must correspond to an existing field
   * defined on this type or its mixins. The value must be of the correct type if doNotConvert flag is true.
   *
   * @param field
   *           the field
   * @param value
   *           of the field
   * @param doNotConvert
   *           if true, do not attempt to convert the value to match the field's type
   * @return new Obj
   *
   * @see #withoutField
   * @see #defaultField
   */
  withField(field: FieldType, value: any, doNotConvert?: boolean): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj instance by adding the provided fields in it. The name must correspond to an existing fields
   * defined on this type or its mixins. The values must be of the correct type if doNotConvert flag is true.
   *
   * @param fields
   *           map of field names/values
   * @param doNotConvert
   *           if true, attempt to convert the values to match the fields' type
   * @return new Obj
   */
  withFields(fields: Map_Type<string, any>, doNotConvert?: boolean): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj with the value at the specified path field. If the field is null, the field #isFieldSet to null.
   * If you would like to #unsetField, you should call #withoutFieldAtPath instead.
   *
   * Immutable objects may return the same instance if the field being set does not actually represent a
   * change to the existing object.
   *
   * @param path
   *           path to set value at
   * @param value
   *           value to set
   * @param doNotConvert
   *           if true, attempt to convert the values to match the fields' type
   * @param doNotCreateIfMissing
   *           true indicates that any empty reference along the path will not set the value
   * @return new Obj
   */
  withFieldAtPath(path: string, value: any, doNotConvert?: boolean, doNotCreateIfMissing?: boolean): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj without the specified path field.
   *
   * Immutable objects may return the same instance if the field being removed does not actually represent a
   * change to the existing object.
   *
   * @param path
   *           path for field to remove
   * @return new Obj
   *
   * @see #withFieldAtPath
   * @see #withoutField
   */
  withoutFieldAtPath(path: string): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, removing the field with the provided name.
   *
   * Immutable objects may return the same instance if the field being removed is not present in the existing object.
   *
   * @param field
   *           name of the field to remove
   * @return new Obj with removed field
   *
   * @see #unsetField
   * @see #removeField
   */
  withoutField(field: string): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, removing the field with the provided field type.
   *
   * Immutable objects may return the same instance if the field being removed is not present in the existing object.
   *
   * @param field
   *           name of the field to remove
   * @return new Obj with removed field
   *
   * @see #unsetField
   * @see #removeField
   */
  withoutField(field: FieldType): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, removing the fields with the provided names.
   *
   * Immutable objects may return the same instance if the fields being removed are not present in the existing object.
   *
   * @param fields
   *           names of the fields to remove
   * @return new Obj with removed fields
   */
  withoutFields(fields: Array_Type<string>): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, removing the fields with the provided field types. Be sure to use the FieldType instance for the
   * exact same type as the type of the obj to respect the "ordinal" of the field type
   *
   * Immutable objects may return the same instance if the fields being removed are not present in the existing object.
   *
   * @param fields
   *           field types to remove
   * @return new Obj with removed fields
   */
  withoutFieldsByType(fields: Array_Type<FieldType>): UiSdlApplicationStateSB;

  /**
   * @return a new Obj, removing the field types marked with annotation @config(secret=true) recursively
   */
  withoutSecretFields(): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj instance by adding the default values (if defined) for all unset fields. This is implemented by
   * calling {@link FieldType#defaultValue defaultValue} for a field if it is not already set and
   * {@link FieldType#hasDefault has a default}. It will also set {@see ValueType#initialValue initial values} for
   * fields with required primitive ValueTypes (E.g. x: `!int32` -> will be set to 0). Note that this will not overwrite
   * fields that have already been set.
   *
   * {@link FunctionParam#validateArg} will call {@link #withDefaults} for {@link Spec}s passed as arguments to methods.
   * As a result, methods should be implemented assuming all default values are set on `Spec` arguments.
   *
   * @param includeEmptyRefsWithDefaults
   *           it `true` then missing / empty child references that have fields with defaults will also be instantiated
   * @param defaultFields
   *           If not empty, a list of default field paths to populate.  Any default fields not specified in the
   *           array will be ignored.
   * @return new Obj
   *
   * @see #defaultField
   * @see FieldType#defaultValueConst
   * @see FieldType#defaultValue
   */
  withDefaults(includeEmptyRefsWithDefaults?: boolean, defaultFields?: Array_Type<string>): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, by setting a field on this `Obj` to the field's default value. If the field has no default, this
   * method will behave the same as {@link #unsetField}.
   *
   * @param field
   *         name of the field to default
   * @return new `Obj` with the specified field set to its default value
   *
   * @see #withField
   * @see #unsetField
   */
  defaultField(field: string): UiSdlApplicationStateSB;

  /**
   * Builds a new Obj, by setting a field on this `Obj` to the fields default value. If the field has no default, this
   * method will behave the same as {@link #unsetField}.
   *
   * @param field
   *         field type to default
   * @return new `Obj` with the specified field set to its default value
   *
   * @see #withField
   * @see #unsetField
   */
  defaultField(field: FieldType): UiSdlApplicationStateSB;

  /**
   * Unsets a field from this `Obj`, meaning that the field will become not {@link #isFieldSet set}. Note that this
   * is different from {@link removeField}
   *
   * @param field
   *         name of the field to unset
   * @return new `Obj` with the specified field unset
   *
   * @see #withoutField
   * @see #removeField
   */
  unsetField(field: string): UiSdlApplicationStateSB;

  /**
   * Unsets a field from this `Obj`, meaning that the field will become not {@link #isFieldSet set}. Note that this
   * is different from {@link removeField}
   *
   * @param field
   *         field type to unset
   * @return new `Obj` with the specified field unset
   *
   * @see #withoutField
   * @see #removeField
   */
  unsetField(field: FieldType): UiSdlApplicationStateSB;

  /**
   * Removes a field from this `Obj`, meaning that the field will become {@link isFieldMissing missing}. Note that this
   * is different from {@link #unsetField}
   *
   * @param field
   *         name of the field to remove
   * @return new `Obj` with the specified field removed
   *
   * @see #withoutField
   * @see #unsetField
   */
  removeField(field: string): UiSdlApplicationStateSB;

  /**
   * Removes a field from this `Obj`, meaning that the field will become {@link isFieldMissing missing}. Note that this
   * is different from {@link #unsetField}
   *
   * @param field
   *         field type to remove
   * @return new `Obj` with the specified field removed
   *
   * @see #withoutField
   * @see #unsetField
   */
  removeField(field: FieldType): UiSdlApplicationStateSB;

  /**
   * Merges all the fields of the provided Obj into this instance, producing a new Obj of the same type as this one.
   * In case of conflicts, fields of other instance take precedence unless otherwise specified by the fieldPathMergeSpec
   *
   * @param other
   *           object
   * @param fieldPathMergeSpec
   *           mapping of fields of the object to the respective merge annotations
   * @return the new merged Obj
   */
  mergeObj(other: Obj, fieldPathMergeSpec?: Map_Type<string, string>): UiSdlApplicationStateSB;

  /**
   * Merges all the fields of the provided Obj into this instance, producing a new Obj of the same type as this one.
   * In case of conflicts, fields of other instance take precedence.
   *
   * @param other
   *           object
   * @param otherFieldsFilter
   *           only fields of otherFieldsFilter type from other are merged into this obj.
   * @return the new merged Obj
   */
  mergeObj(other: Obj, otherFieldsFilter: Type): UiSdlApplicationStateSB;

  /**
   * Merge the fields of this Obj with corresponding fields on other Obj using the provided lambda. This means that
   * fields that exist on other Obj and do not exist on this Obj will not be added to final Obj.
   * @param deep
   *        if set to true then traverse reference and collection fields and merge corresponding fields or elements with
   *        the same key or index.
   */
  mergeObj(other: Obj, deep?: boolean, merger: λQuadFunction<FieldPath | null, any | null, FieldPath | null, any | null, any | null>): UiSdlApplicationStateSB;

  /**
   * Merge the fields of this Obj with corresponding fields on other Obj using the provided lambda. This means that
   * fields that exist other Obj and do not exist on this Obj will not be added to final Obj or evaluated. Does not
   * traverse child reference and collection fields.
   */
  mergeObj(other: Obj, merger: λQuadFunction<FieldType | null, any | null, FieldType | null, any | null, any | null>): UiSdlApplicationStateSB;

  mergeJson(json: any): UiSdlApplicationStateSB;

  /**
   * Merge the obj references within the current obj
   * @param deep
   *        If set, traverses the reference fields within the obj as well for a deep merge
   * @param objKey
   *        lambda specifying how to obtain the key for the Obj while determining which Objs to merge
   * @param filter
   *        Field paths that need to be filtered from this merge
   * @return Obj with child references merged
   */
  mergeChildren(deep?: boolean, objKey?: λFunction<Obj | null, any | null>, filter?: λPredicate<string>): UiSdlApplicationStateSB;

  /**
   * Adds the numeric Obj fields with the other Objs respective fields.
   * If deep is set it will traverse reference and collection fields and sum corresponding numeric fields in
   * references with same name and collection elements at same index or key.
   */
  sumObj(other: Obj, deep?: boolean): UiSdlApplicationStateSB;

  /**
   * Build an array of the correct type with a single element which is this instance.
   *
   * @return new array instance with this as only element.
   */
  singletonArray(): Array_Type<UiSdlApplicationStateSB>;

  /**
   * Creates an array of instances of this type.
   */
  static array(...elements: Array_Type<any>[]): Array_Type<UiSdlApplicationStateSB> | null;

  /**
   * Creates an array of instances of this type.
   */
  static arrayBuilder(): ArrayBuilder<UiSdlApplicationStateSB> | null;

  /**
   * Build an set of the correct type with a single element which is this instance.
   *
   * @return new array instance with this as only element.
   */
  singletonSet(): Set_Type<UiSdlApplicationStateSB>;

  /**
   * Creates a set of instances of this type.
   */
  static setBuilder(): SetBuilder<UiSdlApplicationStateSB> | null;

  /**
   * Create a map of string to elements of this type.
   */
  static mapBuilder(): MapBuilder<string, UiSdlApplicationStateSB> | null;

  /**
   * Create a map with the given key type and elements of this type.
   */
  static mapBuilderOf(keyType: ValueType): MapBuilder<any, UiSdlApplicationStateSB> | null;

  /**
   * @return new ObjBuilder with initial state set to fields of this instance.
   */
  toBuilder(): ObjBuilder<UiSdlApplicationStateSB>;

  /**
   * @return new ObjBuilder of this instance.
   */
  static builder(): ObjBuilder<UiSdlApplicationStateSB>;

  /**
   * Construct instance of this type from provided field values and options
   */
  static fromFields(fields: Map_Type<FieldType, any>, spec: Obj.MakeSpec): UiSdlApplicationStateSB;

  /**
   * Construct an instance of this type from provided fields
   * @param fields
   *            Fields to construct the instance of the obj with
   * @param withDefaults
   *            If set, then the Obj is made with default & initial values (required primitive fields e.g. !int32 -> 0) populated
   *
   * @see withDefaults
   */
  static fromFields(fields: Map_Type<FieldType, any | any>, withDefaults?: boolean): UiSdlApplicationStateSB;

  /**
   * Construct instance of this type from provided field values and options
   */
  static make(fields: Map_Type<string, any>, spec: Obj.MakeSpec): UiSdlApplicationStateSB;

  /**
   * Construct an instance of this type with no non-default field values unless explicitly specified by passing param true
   * @param withDefaults
   *            If set, then the Obj is made with default & initial values (required primitive fields e.g. !int32 -> 0)
   *            populated
   *
   * @see withDefaults
   */
  static make(withDefaults?: boolean): UiSdlApplicationStateSB;

  /**
   * Construct an instance from provided fields
   * @param fields
   *            Fields (in the format <field_name, value>) to construct an instance of the obj. Note that "type" as a
   *            field_name will be considered as the actual Obj's type, e.g. Obj.make({"type": "Panda"}) is equivalent
   *            to Panda.make()
   * @param withDefaults
   *            If set, then the Obj is made with default & initial values (required primitive fields e.g. !int32
   *            -> 0) populated. Passing an empty value for a field will result in the initial value being set if
   *            the field does not {@link ValueModifier#PRESERVES_EMPTY preserve empty}
   *
   *
   * @see fromFields
   * @see beforeMake
   * @see afterMake
   * @see withDefaults
   */
  static make(fields: Map_Type<string, any | any>, withDefaults?: boolean): UiSdlApplicationStateSB;

  /**
   * Construct an instance of this type from provided fields. Note it is more efficient to use #fromFields and other overloads
   *
   * ```js
   * User.make({
   *   email: 'joe@smith.com',
   *   realName: 'Joe Smith'
   * })
   *
   * Obj.make({
   *   type: 'User',
   *   email: 'joe@smith.com',
   *   realName: 'Joe Smith'
   * })
   * ```
   *
   * ```py
   * c3.User.make({
   *   "email": 'joe@smith.com',
   *   "realName": 'Joe Smith'
   * })
   *
   * c3.Obj.make({
   *   "type": 'User',
   *   "email": 'joe@smith.com',
   *   "realName": 'Joe Smith'
   * })
   *
   * c3.User(email='joe@smith.com', realName='Joe Smith')
   *
   * c3.Obj(type='User', email='joe@smith.com', realName='Joe Smith')
   * ```
   *
   * Note that this is **not** the same as the [serialization format](serdeser.c3doc). This is a convenient way to
   * specify fields and values in the "JSON like" form supported by each language, but the usual serialization rules,
   * such as {@link Ann.Ser} do not apply.
   * @param fields
   *            Fields to construct the instance of the obj with
   * @param withDefaults
   *            If set, then the Obj is made with default & initial values (required primitive fields e.g. !int32 -> 0) populated
   *
   * @see fromFields
   * @see beforeMake
   * @see afterMake
   * @see withDefaults
   */
  static make(fields: any, withDefaults?: boolean): UiSdlApplicationStateSB;

  /**
   * Construct an instance of this type from the string. This is an alias for #fromString, as a specific overload
   * when the argument is a known string.
   *
   * @see #fromString
   */
  static make(s: string): UiSdlApplicationStateSB | null;

  /**
   * Construct an instance of this type from provided instance of a subtype or a "duck type".
   */
  static remake(other: Obj, failIfExtraOrInvalidFields?: boolean): UiSdlApplicationStateSB;

  /**
   * Optional override that will be called every time instance of this type is created.
   *
   *
   * Note that it introduces additional overhead so should only be implemented for low volume data.
   */
  static beforeMake(fields: Map_Type<FieldType, any>): Map_Type<FieldType, any> | null;

  /**
   * Optional override that will be called after every instance creation.
   *
   * Note that it introduces additional overhead so should only be implemented for low volume data.
   */
  afterMake(): UiSdlApplicationStateSB;

  /**
   * Creates an empty inst using `MyType.make()` and caches it. Avoid recreating multiple copies of the spec for
   * every action dispatch. The cached inst can also be used for comparing whether the object is an empty or not
   * Will only create empty instance for immutable Obj e.g. if an Obj is Mutable, this method will throw an error
   *
   * @see ValueType#defaultEmptyValue
   */
  static cachedEmptyInst(): UiSdlApplicationStateSB;

  /**
   * Generate a stream of instances of this type. The stream is endless and will call #generateObj each time a new
   * value is read.
   */
  static generateObjs(spec?: Obj.GenerateSpec): Stream<UiSdlApplicationStateSB> | null;

  /**
   * Generate a single instance of this type. The base implementation uses {@link DataGenObj} to generate uniform
   * random (gibberish) values for all fields, but it may be overridden by specific types with custom logic that
   * populates fields in a more realistic way.
   */
  static generateObj(spec?: Obj.GenerateSpec): UiSdlApplicationStateSB;

  /**
   * Fetches multiple obj instances based on a specification.  Only objs that the caller is authorized to fetch will be
   * returned.
   *
   * @param spec
   *           Specification of what data to fetch.  If not specified, no filtering will be applied and a default limit
   *           of 2000 will be applied.
   * @return Requested objs.
   */
  static fetch(spec?: FetchSpec): FetchResult<UiSdlApplicationStateSB>;

  /**
   * Fetches multiple obj instances based on a filter.  Only objs that the caller is authorized to fetch will be
   * returned.
   *
   * @param filter
   *           Specification of filter to apply to data to fetch.  Note that default limit of 2000 will be applied.
   * @return Requested objs.
   */
  static fetch(filter: Filter): FetchResult<UiSdlApplicationStateSB>;

  /**
   * Fetches multiple obj instances based on a specification.  Only objs that the caller is authorized to fetch will be
   * returned.
   *
   * @param spec
   *           Specification of what data to fetch.  If not specified, no filtering or limit will be applied.
   * @return Requested obj stream.
   */
  static fetchObjStream(spec?: FetchStreamSpec): Stream<UiSdlApplicationStateSB> | null;

  /**
   * Fetches multiple obj instances based on a specification and returns them as stream of Arrow batches with
   * specified maximum batch size.
   *
   * @param spec
   *           Specification of what data to fetch.
   * @return Stream of Arrow batches.
   */
  static fetchArrowStream(spec: FetchArrowStreamSpec): Stream<Arrow>;

  /**
   * Fetched multiple obj instances in multiple locales based on specification.
   *
   * @param spec
   *        Specification of what data to fetch. If not specified, all objs will be returned in all locales for the
   *        type.
   * @return Requested objs where key of map is locale id
   */
  static fetchMultiLocale(spec?: MultiLocaleFetchSpec): Map_Type<string, FetchResult<UiSdlApplicationStateSB>> | null;

  /**
   * @return The number of entries that match the specification.
   */
  static fetchCount(spec?: FetchFilterSpec): number;

  /**
   * Gets the estimated count of objs that a fetch on the type with the optional filter will return.
   * For non-kv types, The count is obtained from the query explain plan for the fetch.
   * For kv types, the count is obtained by reading metadata from the state column and approximating the size of every
   * other column based on newColMaxObjCount. Since we compute based on max obj count, this value will be the
   * upper bound for the partition. For more accurate results, perform fillBuckets first.
   *
   * @param spec
   *        Optional filter to use for the estimated count.  Note that since the estimate is obtained from the query
   *        explain plan for the fetch it's accuracy will be MUCH greater if the filter involves only indexed
   *        fields.
   * @param updateStatistics
   *        If true, the database statistics for all tables involved in the query will be updated prior to obtaining
   *        the estimated row count.  This will give the most up to date estimate for types that are updated frequently.
   *
   * @return The requested estimated count.
   */
  static fetchCountEstimated(spec?: FetchFilterSpec, updateStatistics?: boolean): number;

  /**
   * Fetches all the data for this type based on provided filter and include spec, groups them by batchSize and invokes
   * a callback function for the given batch.
   *
   * @param spec
   *           Specification of the scan action.
   * @return Statistics of the scan action.
   */
  static scan(spec: ScanSpec): ScanStats | null;

  /**
   * Returns a stream of ids for batches where the result[i] is the starting id for batch 'i + 1'.
   *
   * @param spec
   *        Spec indicating how the operation should work.
   *
   * IMPORTANT - If both `suggestedNumBatches` and `batchSize` are specified in the spec, then the maximum number of
   *             rows that will participate in the resulting batches is `suggestedNumBatches` * `batchSize`.  This could
   *             cause an issue if the results are blindly used to create filters for fetching batches as the last batch
   *             would include EVERYTHING after the requested number of batches.  Therefore, typically only one or the
   *             other would be specified, depending on whether you are interested in controlling the number of batches
   *             or batch size.
   *
   * @return A stream of batch ids based on the input parameters.
   */
  static batchIds(spec?: BatchIdsSpec): Stream<string> | null;

  /**
   * @return True if there are at least the number of entries matching the filter/count specified in the spec.
   */
  static exists(spec?: ExistsSpec): boolean;

  /**
   * @return True if there are at least the number of entries matching the filter/count specified in the spec.
   */
  static exists(filter: Filter): boolean;

  /**
   * @return key field type.
   */
  static keyFieldType(): FieldType;

  /**
   * @return key field value.
   */
  keyFieldValue(): string | null;

  /**
   * Build a map of the correct type with a single element which is this instance and key field value as key.
   */
  singletonMap(): Map_Type<string, WithKey>;

  /**
   * Retrieves dependencies to types or other metadata elements for the given instance of metadata.
   */
  dependencies(): MetadataDeps<UiSdlApplicationStateSB>;

  save(subPath?: string, contentType?: string): UiSdlApplicationStateSB;

  remove(spec?: UpsertSpec): boolean;

  /**
   * Remove the metadata instance as well as its associated backward dependencies.
   * Ex: {@link SourceSystem} has backward dependencies on {@link SourceCollection}
   */
  removeWithChildren(): boolean;

  static removeAll(removeFilter?: string): number;

  update(srcObj?: UiSdlApplicationStateSB, spec?: UpsertSpec): UiSdlApplicationStateSB | null;

  upsert(srcObj?: UiSdlApplicationStateSB, spec?: UpsertSpec): UiSdlApplicationStateSB | null;

  /**
   * Retrieves folder that holds metadata.
   */
  static metadataFolder(): string | null;

  /**
   * If this Metadata type has arbitrary folder hierarchy.
   */
  static hasArbitraryFolderHierarchy(): boolean;

  /**
   * If metadata path is valid.
   * @param pkg
   *    name of the package
   * @param filePath
   *    path of metadata json file
   */
  static isValidMetadataJson(pkg: string, filePath: string): boolean;

  /**
   * Optional member function to enable custom validation logic.
   */
  validateMetadata(): ValidateObjResult;

  /**
   * Build the canonical string representation of this instance. This must be implemented to provide serialization.
   *
   * If the object has no content, and fromString would properly reproduce it from a null value, toString may return
   * null or empty string. Note that toString is primarily for serialization and only secondarily for inspection.
   *
   * @see #fromString
   */
  toString(): string | null;

  /**
   * Parse the string-based representation and reconstruct the corresponding instance. This must be implemented to
   * provide deserialization.
   *
   * fromString is called on the type be deserialized and must reconstruct an Obj of the appropriate type (which may be
   * a type that mixes in the type on which it is called). This means that the resulting object's type can be a sub-type
   * of called-on type, but perhaps not the same type.
   *
   * E.g. `Url.fromString('c3fs:///...')` will produce {@link FileUrl}
   *
   * @see #toString
   */
  static fromString(s: string): UiSdlApplicationStateSB | null;

  /**
   * @return single instance of this Identified type by id.
   */
  static forId(id: string, failIfMissing?: boolean): UiSdlApplicationStateSB | null;

  jsonStringify(): string | null;

  static jsonify(value?: any): string | null;

  /**
   * A function to perform the setting and merging of keys and values for the dataSpec
   * and entity data in the react props. Components that need custom merging of multiple or nested datasources
   * should override this function and provide their own custom setting/merging logic.
   *
   * @param componentId
   *           The id of the component on which the function is being called
   * @param dataSpecFieldName
   *           The name of the field which is annotated as a dataSpec
   * @param dataDestinationFieldName
   *           Contains field name to store the returned data
   * @param props
   *           The object that will eventually be delivered to the component as react props
   * @param state
   *           The redux state
   * @returns props after the data has been set/merged
   */
  static doDataMerge(componentId: string, dataSpecFieldName: string, dataDestinationFieldName: string, props: UiSdlApplicationStateSB, state: UiSdlReduxState): UiSdlApplicationStateSB | null;

  /**
   * Triggered the first time a component renders. Applications should never
   * trigger this action manually, as it will be triggered internally by the
   * framework. If multiple instances of the same component (i.e. having the
   * same id) are present on a single page, the framework _may_ trigger this
   * action multiple times—at most once per component instance and at least once
   * overall.
   *
   * @param id
   *           The id of the component that is rendered.
   * @returns an `INITIAL_RENDER` action.
   */
  static renderInitialAction(id: string): UiSdlInitialRenderAction;

  /**
   * Triggered the first time a component renders. Component will trigger this action
   * when it registers effect triggers
   * @param id
   *           The id of the component that is rendered.
   * @returns an `REGISTER_TRIGGERS` action.
   */
  static registerTriggersAction(id: string): UiSdlRegisterTriggersAction;

  /**
   * Listens for actions of type `REGISTER_TRIGGERS` and flips a triggersRegistered when effect triggers are registered
   *
   * @param state
   *           Redux state
   * @param action
   *           Redux action
   * @returns a new Redux state
   */
  triggersRegisterEffect(state: UiSdlReduxState, action: UiSdlRegisterTriggersAction): UiSdlReduxState;

  /**
   * Gets the namespace for this state
   * @return the namespace
   */
  static getStateNamespace(): string | null;

  /**
   * Gets the namespace for the initial state
   * @return the namespace
   */
  static getInitialStateNamespace(): string | null;

  /**
   * Gets the entire path to the state
   * @param id
   *           The id of the stateful entity
   * @return an array of the entire path to the state
   */
  static getConfigStatePath(id?: string): Array_Type<string> | null;

  /**
   * Gets the enire path to the initial state
   * @param id
   *           The id of the stateful entity
   * @return an array of the entire path to the initial state
   */
  static getInitialConfigStatePath(id?: string): Array_Type<string> | null;

  /**
   * Helper method to retrieve config values from the state.
   *
   * @param id The stateful entity holding the config
   * @param state The Redux state
   * @param dataPath The path to the config
   * @returns The config value as UiSdlImmutableJS
   */
  static getConfigFromState(id?: string, state?: UiSdlReduxState, dataPath?: Array_Type<string>): UiSdlImmutableJS<any> | null;

  /**
   * Helper method to retrieve config values from the state.
   *
   * @param id The stateful entity holding the config
   * @param state The Redux state
   * @param dataPath The path to the config
   * @param value The value to set
   * @returns The new state as UiSdlImmutableJS
   */
  static setConfigInState(id?: string, state?: UiSdlReduxState, dataPath?: Array_Type<string>, value?: any): UiSdlImmutableJS<any> | null;

  /**
   * Helper method to retrieve initial config values from the state.
   *
   * @param id The stateful entity holding the config
   * @param state The Redux state
   * @param dataPath The path to the config
   * @returns The config value as UiSdlImmutableJS
   */
  static getInitialConfigFromState(id?: string, state?: UiSdlReduxState, dataPath?: Array_Type<string>): UiSdlImmutableJS<any> | null;

  /**
   * Helper method to retrieve initial config values from the state.
   *
   * @param id The stateful entity holding the config
   * @param state The Redux state
   * @param dataPath The path to the config
   * @param value The value to set
   * @returns The new state as UiSdlImmutableJS
   */
  static setInitialConfigInState(id?: string, state?: UiSdlReduxState, dataPath?: Array_Type<string>, value?: any): UiSdlImmutableJS<any> | null;

  /**
   * Determines whether or not the `UiSdlState` can update state outside of its own state
   * @return true if the `UiSdlState` should not be able to set state outside of its own state
   */
  static isLimitEffectOnState(): boolean;

  /**
   * Retrieves config value from application state.
   *
   * @param stateId
   *           Id of the state.
   * @param state
   *           Redux state.
   * @param dataPath
   *           The path to the config value.
   * @returns Redux state.
   */
  static getConfigFromApplicationState(stateId: string, state: UiSdlReduxState, dataPath?: Array_Type<string>): UiSdlReduxState;

  /**
   * Sets config value in application state.
   *
   * @param stateId
   *           Id of the state.
   * @param state
   *           Redux state.
   * @param dataPath
   *           The path to the config value.
   * @param value
   *           The config value to set.
   * @returns Redux state.
   */
  static setConfigInApplicationState(stateId: string, state: UiSdlReduxState, dataPath?: Array_Type<string>, value: any): UiSdlReduxState;

  /**
   * Remove config value in the state.
   *
   * @param stateId
   *           Id of the state.
   * @param state
   *           Redux state.
   * @param dataPath
   *           The path to the config value.
   * @returns Redux state.
   */
  static removeConfigInApplicationState(stateId: string, state: UiSdlReduxState, dataPath?: Array_Type<string>): UiSdlReduxState;

  /**
   * Triggers when the `UiSdlApplicationState` is initialized.
   *
   * @param stateId
   *            Id of the state.
   * @return a 'APPLICATION_STATE_INITIALIZE' action.
   */
  static initializeApplicationStateAction(stateId: string): UiSdlApplicationStateInitializeAction;

  /**
   * Action to delete data in a certain slice of the application state
   *
   * @param stateId
   *            Id of the state.
   * @param ids
   *            Ids of the objects to be deleted
   * @param dataPath
   *            slice of the application state to put the new object in
   * @return a 'APPLICATION_STATE_DATA_DELETE' action.
   */
  static applicationStateDeleteDataAction(stateId: string, ids?: Array_Type<string>, dataPath?: string): UiSdlApplicationStateDataDeleteAction;

  /**
   * Action to add data to a certain slice in the application state
   *
   * @param stateId
   *            Id of the state.
   * @param id
   *            Id of the newly added object
   * @param dataPath
   *            slice of the application state to put the new object in
   * @return a 'APPLICATION_STATE_DATA_ADD' action.
   */
  static applicationStateAddDataAction(stateId: string, id?: string, dataPath?: string): UiSdlApplicationStateDataAddAction;

  /**
   * Action to modify data to a certain slice in the application state
   *
   * @param stateId
   *            Id of the state.
   * @param id
   *            Id of the newly added object
   * @param dataPath
   *            slice of the application state to put the new object in
   * @return a 'APPLICATION_STATE_MODIFY_ADD' action.
   */
  static applicationStateModifyDataAction(stateId: string, id?: string, dataPath?: string, field?: string, newValue?: any): UiSdlApplicationStateDataModifyAction;

  /**
   * Listens to actions of 'APPLICATION_STATE_DATA_DELETE' and delete objects in the application state.
   *
   * @param state
   *            Redux state.
   * @param action
   *            Redux action.
   * @return the new Redux state.
   */
  static applicationStateDataDeleteEffect(state: UiSdlReduxState, action: UiSdlApplicationStateDataDeleteAction): UiSdlReduxState;

  /**
   * Listens to actions of 'APPLICATION_STATE_DATA_ADD' and add new data to the specified data path in the payload.
   *
   * @param state
   *            Redux state.
   * @param action
   *            Redux action.
   * @return the new Redux state.
   */
  static applicationStateDataAddEffect(state: UiSdlReduxState, action: UiSdlApplicationStateDataAddAction): UiSdlReduxState;

  /**
   * Listens to actions of 'APPLICATION_STATE_DATA_MODIFY' and add new data to the specified data path in the payload.
   *
   * @param state
   *            Redux state.
   * @param action
   *            Redux action.
   * @return the new Redux state.
   */
  static applicationStateDataModifyEffect(state: UiSdlReduxState, action: UiSdlApplicationStateDataModifyAction): UiSdlReduxState;

  /**
   * Generates a function that is able to return the application metadata from the redux state.
   * @param applicationId
   *            The application ID to generate a selector for
   * @return a function that can return the metadata for the applicationID when given the redux state
   */
  static generateSelector(applicationId?: string): λFunction<UiSdlReduxState | null, UiSdlImmutableJS<UiSdlApplicationState> | null> | null;

  static rowRecordStoreReducer(state: UiSdlReduxState, action?: UiSdlReduxAction<any>): UiSdlReduxState | null;

  static storeRowRecordAction(id?: string, obj?: any): UiSdlReduxAction<any> | null;
}


interface λFunction<T, R> {
  (t: T): R
}

interface λBiFunction<T, U, R> {
  (t: T, u: U): R
}

interface λQuadFunction<T, U, V, W, R> {
  (t: T, u: U, v: V, w: W): R
}

interface λPredicate<T> {
  (t: T): boolean
}
