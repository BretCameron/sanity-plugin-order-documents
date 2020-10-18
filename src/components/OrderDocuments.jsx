import React from "react";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import client from "part:@sanity/base/client";
import { withRouterHOC } from "part:@sanity/base/router";
import styles from "../index.css";
import { setOrder, setListOrder } from "../functions";
import { DEFAULT_FIELD_VALUE, DEFAULT_FIELD_LABEL } from "../data";
import DraggableSection from "./organisms/DraggableSection";
import TypeSection from "./organisms/TypeSection";

class OrderDocuments extends React.Component {
  state = {
    documents: [],
    type: { label: "", value: "" },
    field: { label: DEFAULT_FIELD_LABEL, value: DEFAULT_FIELD_VALUE }
  };

  handleFieldChange = async ({ value, label }) => {
    const documents = await client.fetch(
      `*[!(_id in path("drafts.**")) && _type == $types][0...100] | order (${value} asc, order asc, _updatedAt desc)`,
      { types: this.state.type.value }
    );

    this.setState({ field: { value, label }, documents });

    if (documents.length > 0) {
      await setListOrder(this.state.documents, value);
    }
  };

  handleTypeChange = async ({ value, label }) => {
    const documents = await client.fetch(
      `*[!(_id in path("drafts.**")) && _type == $types][0...100] | order (${this.state.field.value} asc, order asc, _updatedAt desc)`,
      { types: value }
    );

    this.setState({ type: { value, label }, documents });

    if (documents.length > 0) {
      await setListOrder(this.state.documents, this.state.field.value);
    }
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
      setOrder(card1._id, afterIndex, this.state.field.value),
      setOrder(card2._id, beforeIndex, this.state.field.value)
    ]);
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <div className={styles.outerWrapper}>
            <div className={styles.innerWrapper}>
              <TypeSection
                {...this.state}
                handleTypeChange={this.handleTypeChange}
                handleFieldChange={this.handleFieldChange}
              />
              <DraggableSection
                documents={this.state.documents}
                type={this.state.type}
                moveCard={this.moveCard}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
}

export default withRouterHOC(OrderDocuments);
