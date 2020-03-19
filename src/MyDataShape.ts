/**
 * This is an example of a data shape. Data shapes are classes that must extend from `DataShapeBase`.
 */
class LinkedList extends DataShapeBase {

    /**
     * Data shape fields are specified as properties. The `@primaryKey` decorator
     * can be used to mark fields as primary keys.
     */
    @primaryKey name!: STRING;

    next!: INFOTABLE<LinkedList>
}