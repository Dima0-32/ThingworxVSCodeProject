/**
 * This example file shows how to define a Thing using TypeScript.
 * NOTE: I am in the process of providing a nicer example.
 * 
 * A Thing is identified via the `@ThingDefinition` decorator.
 * Additional aspects are also specified via decorators:
 * - `@published`:                                   Marks the thing as published via federation
 * - `@valueStream("MyValueStream")`:                Assigns a value stream
 * - `@editable`:                                    Makes this entity editable in composer
 * 
 * A Thing must extend from one of the thing shape classes. 
 * If thing shapes must be applied then the superclass changes into `ThingTemplateWithShapes(template, ...)`, where
 * - The first parameter represents the name of the base thing template
 * - One or more subsequent parameters are each the name of a thing shape that the thing will implement
 */
@ThingDefinition @published class MyThing extends ThingTemplateWithShapes(RemoteThing, Connectable) {

    /**
     * Thing properties are specified as regular class properties.
     * Note that a type annotation is required and must be one of the Thingworx
     * base types (e.g. `STRING` instead of `string`).
     * 
     * Aspects such as `persistent` and `logged` are specified as decorators.
     * The `readonly` aspect is specified via the regular `readonly` keyword.
     */
    @persistent @logged myProperty: STRING = "This is the default value";

    /**
     * Properties that don't have a default value must be implicitly unwrapped.
     * 
     * Local bindings are specified using the `@local(source, sourceProperty)` decorator, where:
     *  - The first parameter is the name of the source thing.
     *  - The second parameter is the name of the property to bind to.
     */
    @local('AuditArchiveCleanupScheduler', 'Enabled') readonly locallyBoundProperty!: STRING;

    /**
     * Remotely bound properties are specified via the 
     * `@remote(name, {cacheTime?, pushType?, pushThreshold?, startType?,foldType?, imeout?})` decorator. From this decorator only
     * the first parameter is required. It represents the name of the remote property.
     */
    @remote('test', {cacheTime: 0, foldType: 'NONE', pushType: "Value"}) 
    remotelyBoundProperty!: NUMBER;

    /**
     * The data change type is specified via the `@dataChangeType(type)` decorator.
     * 
     * Note that some base types are generics in TypeScript. THINGNAME is such as a base type; it takes two type arguments:
     *  - The first argument is the thing template name or `undefined`. If specified, this must be a string literal or the `undefined` keyword.
     *  - The second argument is the thing shape name or `undefined`. If specified, this must be a string literal or the `undefined` keyword.
     */
    @dataChangeType('ALWAYS') streamToUse!: THINGNAME<'Stream'>;

    /**
     * Events are just properties with the custom `EVENT` base type. The data shape to use is specified as
     * a type argument.
     */
    customEvent!: EVENT<GenericStringList>;

    /**
     * Services created through this project are marked overridable as default. Use the `@final` decorator to make a service non-overridable.
     * 
     * Use the `async` keyword to mark a service async. You cannot specify a return type in this case. Note that you cannot use the
     * `await` keyword in these services as the `async` modifier is erased at runtime.
     * 
     * Service parameters must be specified as a destructured object like in the example below.
     */
    @final async asyncService({v = "wow", it}: {v: STRING, it?: INFOTABLE<GenericStringList>}) {
        var x = Things[this.streamToUse];

        this.streamToUse = 'AnomalyMonitorStateStream';

        var data = x.QueryStreamEntriesWithData();

        var y = Things.DownloadedSolutions;
        y.AnyAlertAck();

        this.customEvent({item: 'test'});
        this.asyncService({v: 'test'});
    }

    /**
     * Remote services are specified via `@remoteService` decorator. Just like with properties, only the first parameter
     * of this decorator is required.
     */
    @remoteService('remoteService', {enableQueue: true}) remoteService(): NOTHING {}

    /**
     * The `@localSubscription(event[, property])` decorator is used to create subscription to an entity's own events.
     */
    @localSubscription('DataChange', 'streamToUse') streamToUseChanged(alertName: STRING, eventData: INFOTABLE<DataChangeEvent>, eventName: STRING, eventTime: DATETIME, source: STRING, sourceProperty: STRING) {

    }

    /**
     * The `@subscription(name, event[, property])` decorator is used to create subscriptions to other entities' events.
     * 
     * Note that in this case, the name of the parameters used by this method cannot be changed or it will lead to runtime errors.
     */
    @subscription('AuditDataTable', 'DataChange', "thingTemplate") auditDataTableThingTemplateChanged(alertName: STRING, eventData: INFOTABLE<DataChangeEvent>, eventName: STRING, eventTime: DATETIME, source: STRING, sourceProperty: STRING) {

    }

    /**
     * Remote events are specified via the `@remoteEvent(name)` decorator.
     */
    @remoteEvent('remoteEvent') remoteEvent!: EVENT<GenericStringList>;

}