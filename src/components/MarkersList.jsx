import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ title, deleteMarker, id }) => {
  return (
    <li className="list-group-item">
      <span>
        {title}
      </span>
      <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteMarker(id)} type="button">Delete</button>
    </li>
  );
});

const SortableList = SortableContainer(({ items, deleteMarker }) => {
  return (
    <ul className="list-group">
      {items.map(({ title, id }, index) => (
        <SortableItem
          key={`item-${id}`}
          index={index}
          id={id}
          title={title}
          deleteMarker={deleteMarker}
        />
      ))}
    </ul>
  );
});

const MarkersList = (props) => {
  const { afterSort, markers, deleteMarker } = props;
  return (
    <SortableList
      deleteMarker={deleteMarker}
      items={markers}
      onSortEnd={afterSort}
    />
  );
};

export default MarkersList;
