
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import PieChart from "../graphs/piechart";
import '../../App.css';
import { useSnackbar } from "notistack";
import BubbleGraph from "../graphs/BubbleGraph";
import BarGraph from "../graphs/Bargraph";
import Header from "./header";
import "./homcom.css";
const { ipcRenderer } = window.require('electron');
function Sellerview() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortingCriteria, setSortingCriteria] = useState("");
    let count = 0;
    let typeo = Cookies.get('type');
    const [Data, setData] = useState([]);
    const [user, setuser] = useState([]);
    const sel = (typeo == "seller" ? "access" : "companyaccess");
    const username = Cookies.get('username');
    const [patch, setpatch] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [inputValues, setInputValues] = useState(Array(sortedData.length).fill(''));
    const { enqueueSnackbar } = useSnackbar();
    const [selectValues, setSelectValues] = useState(user.map((item) => ""));
    const [excelDownloaded, setExcelDownloaded] = useState(false);
    const [pdfDownloaded, setpdfdownloaded] = useState(false);

    useEffect(() => {
        ipcRenderer.send('fetchData', [`http://localhost:8080/${sel}/${username}`, `http://localhost:8080/history/view/${username}`]);
        ipcRenderer.on('setData', (event, { index, data }) => {
            if (index === 0) {
                setuser(data);
            } else {
                setData(data);
            }
        });
        return () => {
            ipcRenderer.removeAllListeners('setData');
        };
    }, []);

    const handleSelectChange = (index, value) => {
        const newSelectValues = [...selectValues];
        newSelectValues[index] = value;
        setSelectValues(newSelectValues);
    };
    const handleSortingChange = (event) => {
        setSortingCriteria(event.target.value);
        count = count + 1;
    };

    const handleEdit = async (id, index) => {
        ipcRenderer.send('handleEdit', { typeo, id, type: selectValues[index] });
        window.location.reload();
        enqueueSnackbar("Updated Sucessfully");
    }

    const handleChangein = (index, e) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = e.target.value;
        setInputValues(newInputValues);
    };
    const handlestock = (id, topic, count, index) => {
        if (count <= 0) {
            enqueueSnackbar("Enter a Number greater than 0")
        }
        else {
            ipcRenderer.send('handleStock', { id, topic, count });
            enqueueSnackbar("Updated Sucessfully");
        }
        window.location.reload();
    }

    const handleRemove = (id) => {
        ipcRenderer.send('handleRemove', id, sel);
        window.location.reload();
        enqueueSnackbar("Updated Sucessfully");
    }
    const filterData = (data, query) => {
        return data.filter((item) => item.topic.toLowerCase().includes(query.toLowerCase()));
    };
    useEffect(() => { setpatch(filterData(Data, searchQuery)); }, [Data, searchQuery])
    useEffect(() => {
        const sorted = [...(patch)].sort((a, b) => {
            if (sortingCriteria === "cost") {
                return b.cost - a.cost;
            } else if (sortingCriteria === "count") {
                return b.count - a.count;
            }
            else if (sortingCriteria === "revenue") {
                return (b.cost) * (b.count) - ((a.cost) * (a.count));
            }
            else {
                return 0;
            }
        });
        setSortedData(sorted);
    }, [sortingCriteria, patch])
    const renderInputField = (type, placeholder, value, onChange, style, classs) => (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={style} className={classs}
        />);

    useEffect(() => {
        if (excelDownloaded)
            enqueueSnackbar('Excel file downloaded in Downloads');
        if (pdfDownloaded)
            enqueueSnackbar('Pdf file downloaded in Downloads');
    }, [excelDownloaded, pdfDownloaded]);

    const handleDownloadExcel = () => {
        ipcRenderer.send('downloadExcel', sortedData);
    };
    const handleDownloadPDF = () => {
        ipcRenderer.send('downloadPDF', sortedData);
    };
    ipcRenderer.on('excelDownloaded', () => {
        setExcelDownloaded(true);
    });
    ipcRenderer.on('pdfDownloaded', () => {
        setpdfdownloaded(true);
    });
    return (<>
        <Header />
        <div className="sellerhome">
            <h2 className="rembut">SOLD HISTORY:</h2>
            <div className="search-container">
                {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
                <select value={sortingCriteria} onChange={handleSortingChange} className="sellersort">
                    <option value="">Sort</option>
                    <option value="cost">By Cost</option>
                    <option value="count">By Count</option>
                    <option value="revenue">By Revenue</option>
                </select>
            </div>
            <div>
                <BarGraph data={sortedData} />
                <div className="chart">
                    <h2 className="rembut">Revenue:</h2>
                    <PieChart data={sortedData} />
                </div>
                <BubbleGraph data={sortedData} />
            </div>
            {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
            <div>
                <table className="purchase-history-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Topic</th>
                            <th>Count</th>
                            <th>Stock</th>
                            <th>Seller</th>
                            <th className="add-stock-cell">Add Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData).map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.topic}</td>
                                <td>{item.count}</td>
                                <td>{item.stockcount}</td>
                                <td>{item.seller}</td>
                                <td className="add-stock-cell">{renderInputField("number", "count", inputValues[index], (e) => handleChangein(index, e), { backgroundColor: "#E4F1FF", color: "black", border: "none", padding: "5px", width: "50px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px", })}
                                    <button onClick={() => handlestock(item.id, item.topic, inputValues[index], index)} className="cart-button" >Add</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="logout-button">
                <button onClick={handleDownloadExcel} className="purple">Download Excel</button>
                <button onClick={handleDownloadPDF} className="purple">Download PDF</button>
            </div>
            <h2>Users</h2>
            <table className="purchase-history-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>user</th>
                        <th>type</th>
                        <th>Remove</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {(user).map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.username}</td>
                            <td>{item.type}</td>
                            <td><button className="cart-button" onClick={() => handleRemove(item.id)} >Remove</button></td>
                            <td><select
                                value={selectValues[index]}
                                onChange={(e) => handleSelectChange(index, e.target.value)}
                                className="sellerselect"><option value="">Select Type</option>
                                <option value="cost">Cost</option>
                                <option value="count">Count</option>
                                <option value="revenue">Revenue</option>
                            </select>
                                <button className="cart-button" onClick={() => handleEdit(item.id, index)} >Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    )
}
export default Sellerview;