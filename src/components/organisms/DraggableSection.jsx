import React from "react";
import Spinner from "part:@sanity/components/loading/spinner";
import Preview from "part:@sanity/base/preview";
import schema from "part:@sanity/base/schema";
import styles from "../../index.css";
import { Card } from "../molecules/Card";
import RefreshIcon from "../atoms/RefreshIcon";

class DraggableSection extends React.Component {
  render() {
    const { documents, count, type, moveCard, onDragEnd, refreshDocuments, loadMore } = this.props;

    if (!(type && type.value) && !documents.length) {
      return null;
    }

    if (type && type.value && !documents.length) {
      return (
        <div className={styles.orderDocumentsMarginTop}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    const hasReachedEnd = documents.length === count;

    return (
      <>
        <hr className={styles.orderDocumentsRule} />
        <div className={styles.orderDocumentsSubheading}>
          <p>
            <strong>Step 2: Drag and Drop to Re-order</strong>
          </p>
          <button className={styles.orderDocumentsRefreshButton} onClick={refreshDocuments}>
            <RefreshIcon title="Refresh Documents" />
          </button>
        </div>
        <ul className={styles.orderDocumentsList}>
          {documents.map((document, index) => (
            <li key={document._id} className={styles.orderDocumentsListItem}>
              <Card
                key={document._id}
                index={index}
                id={document._id}
                text={document.title}
                moveCard={moveCard}
                onDragEnd={onDragEnd}
                jsx={<Preview value={document} type={schema.get(document._type)} />}
              />
            </li>
          ))}
        </ul>
        {hasReachedEnd ? null : (
          <div className={styles.orderDocumentsButtonWrapper}>
            <button className={styles.orderDocumentsButton} onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </>
    );
  }
}

export default DraggableSection;
