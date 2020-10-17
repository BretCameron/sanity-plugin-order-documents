import React from "react";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import client from "part:@sanity/base/client";
import { withRouterHOC } from "part:@sanity/base/router";
import styles from "../index.css";
import { setOrder, setListOrder } from "../functions";
import { DEFAULT_FIELD_VALUE } from "../data";
import DraggableSection from "./organisms/DraggableSection";
import TypeSection from "./organisms/TypeSection";

class OrderDocuments extends React.Component {
  constructor() {
    super();
    this.observables = {};
    this.state = {
      documents: [],
      type: { label: "", value: "" },
      field: DEFAULT_FIELD_VALUE
    };
  }

  handleReceiveList = async documents => {
    this.setState({ documents });

    if (documents && documents.length > 0) {
      await setListOrder(documents, this.state.field);
    }
  };

  handleFieldChange = ({ value }) => {
    this.setState({ field: value, documents: [] }, async () => {
      this.observables = {};
      this.observables = client.observable
        .fetch(
          `*[!(_id in path("drafts.**")) && _type == $types][0...100] | order (${value} asc, order asc, _updatedAt desc)`,
          { types: this.state.type.value }
        )
        .subscribe(this.handleReceiveList);

      if (documents && documents.length > 0) {
        await setListOrder(documents, value);
      }
    });
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

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className={styles.container}>
          <div className={styles.outerWrapper}>
            <div className={styles.innerWrapper}>
              <TypeSection
                {...this.state}
                handleChange={this.handleChange}
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
