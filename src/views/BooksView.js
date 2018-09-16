import React, { Component } from 'react';

export default class BooksView extends Component {
    render() {
        let bookRows = this.props.books.map(book =>
            <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.description}</td>
                {this.getActions(book, this.props.userId)}
            </tr>
        );
        
        return (
            <div className="books-view">
                <h1>Books</h1>
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookRows}
                    </tbody>
                </table>
            </div>
        );
    }

    getActions(book, userId) {
        if (book._acl.creator === userId)
            return (
                <td>
                    <button onClick={this.props.editBookClicked.bind(this, book._id)}>Edit</button>
                    <button onClick={this.props.deleteBookClicked.bind(this, book._id)}>Delete</button>
                </td>
            );
        else
            return <td></td>;
    }
}
