import React from "react";
import update from "immutability-helper";
import Select from "react-select";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Spinner from "part:@sanity/components/loading/spinner";
import Preview from "part:@sanity/base/preview";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import { withRouterHOC } from "part:@sanity/base/router";
import styles from "../index.css";
import { getDocumentTypeNames, setOrder, setListOrder } from "../functions";
import { Card } from "./Card";
import { DEFAULT_FIELD_VALUE, DEFAULT_FIELD_LABEL } from "../data";
import { getHiddenNumberFields } from "../functions/getHiddenNumberFields";

const TOGGLE_FIELD_SELECTOR = true;

class OrderDocuments extends React.Component {
  constructor() {
    super();
    const fields = getHiddenNumberFields();
    this.observables = {};
    this.state = {
      documents: [],
      type: { label: "", value: "" },
      field: DEFAULT_FIELD_VALUE,
      fields,
      showFields: fields.length > 1 && fields.findIndex(field => field.name === "order") !== -1
    };
  }

  handleFieldChange = ({ value }) => {
    this.setState({ field: value, type: "" });
    this.handleReceiveList([]);
  };

  handleReceiveList = async documents => {
    this.setState({ documents });
    await setListOrder(documents, this.state.field);
  };

  handleChange = ({ value, label }) => {
    this.setState({ type: { value, label } });
    this.observables = client.observable
      .fetch(
        `*[!(_id in path("drafts.**")) && _type == $types][0...100] | order (${this.state.field} asc, order asc, _updatedAt desc)`,
        { types: value }
      )
      .subscribe(this.handleReceiveList);
  };

  moveCard = async (beforeIndex, afterIndex) => {
    const card1 = this.state.documents[beforeIndex];
    const card2 = this.state.documents[afterIndex];

    this.setState({
      documents: update(this.state.documents, {
        $splice: [
          [beforeIndex, 1],
          [afterIndex, 0, card1]
        ]
      })
    });

    await Promise.all([
      setOrder(card1._id, afterIndex, this.state.field),
      setOrder(card2._id, beforeIndex, this.state.field)
    ]);
  };

  renderDocumentsList() {
    const { documents } = this.state;

    if (!documents) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    const uniqueTypes = (getDocumentTypeNames(this.state.field) || []).map(({ name, title }) => ({
      value: name,
      label: title
    }));

    const uniqueFields = this.state.fields.map(({ name, title }) => ({
      value: name,
      label: name === DEFAULT_FIELD_VALUE ? DEFAULT_FIELD_LABEL : title
    }));

    return (
      <>
        <div className={styles.flexSpaceBetween}>
          <div>
            <h2 className={styles.noTopMargin}>Order Documents</h2>
            <p>Order your documents via drag-and-drop.</p>
          </div>
          <div>
            {TOGGLE_FIELD_SELECTOR && this.state.showFields ? (
              <div className={styles.fieldButton} onClick={this.handleFieldNameClick}>
                <Select
                  options={uniqueFields}
                  isSearchable
                  onChange={this.handleFieldChange}
                  defaultValue={{ value: DEFAULT_FIELD_VALUE, label: DEFAULT_FIELD_LABEL }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <hr />
        <p>
          <strong>Step 1: Choose a Type</strong>
        </p>
        <Select
          options={uniqueTypes}
          isSearchable
          onChange={this.handleChange}
          value={this.state.type}
        />
      </>
    );
  }

  renderDraggableSection() {
    const { documents, type } = this.state;

    if (!(type && type.value) && !documents.length) {
      return null;
    }

    if (type && type.value && !documents.length) {
      return (
        <div className={styles.marginTop}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    return (
      <>
        <hr className={styles.rule} />
        <p>
          <strong>Step 2: Drag and Drop to Re-order</strong>
        </p>
        <ul className={styles.list}>
          {documents.map((document, index) => (
            <li key={document._id} className={styles.listItem}>
              <Card
                key={document._id}
                index={index}
                id={document._id}
                text={document.title}
                moveCard={this.moveCard}
                jsx={<Preview value={document} type={schema.get(document._type)} />}
              />
            </li>
          ))}
        </ul>
      </>
    );
  }

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <div className={styles.outerWrapper}>
            <div className={styles.innerWrapper}>
              {this.renderDocumentsList()}
              {this.renderDraggableSection()}
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
}

export default withRouterHOC(OrderDocuments);
