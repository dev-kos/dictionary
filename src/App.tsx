import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Typography,
  Button,
  Alert,
  Snackbar,
  TextField,
} from "@mui/material";
import { AddWord } from "./components/AddWord/AddWord";
import { DictionaryItem } from "./types";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { columns } from "./constants";
import catUrl from './assets/images/cat.gif';

function App() {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [rows, setRows] = useState<DictionaryItem[]>([]);
  const [filteredRows, setFilteredRows] = useState<DictionaryItem[]>([]);
  const [selected, setSelected] = useState<GridRowId[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    updateTable();
  }, []);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    setFilteredRows(
      rows.filter(
        (el) =>
          el.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.ru.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, rows]);

  const handleSuccess = () => {
    setIsAlert(true);
    updateTable();
  };

  const updateTable = () => {
    const rawDictionary = localStorage.getItem("dictionary");
    if (rawDictionary) {
      const dictionary: DictionaryItem[] = JSON.parse(rawDictionary);
      setRows(dictionary);
    }
  };

  const handleRemove = () => {
    const rawDictionary = localStorage.getItem("dictionary");
    if (rawDictionary) {
      const dictionary: DictionaryItem[] = JSON.parse(rawDictionary);
      localStorage.setItem(
        "dictionary",
        JSON.stringify(dictionary.filter((el) => el.id !== selected[0]))
      );
      updateTable();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: "20px",
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dictionary
        </Typography>
        <img className="cat" src={catUrl} alt="" />
        <Box>
          {selected.length === 1 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleRemove}
              sx={{ margin: "0 20px" }}
            >
              Remove word
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsModal(true)}
          >
            Add new word
          </Button>
        </Box>
        <AddWord
          isOpen={isModal}
          handleOpen={setIsModal}
          onSuccess={handleSuccess}
        />
        <Snackbar
          open={isAlert}
          autoHideDuration={5000}
          onClose={() => setIsAlert(false)}
        >
          <Alert
            onClose={() => setIsAlert(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Word was successfully added
          </Alert>
        </Snackbar>
      </AppBar>
      <Box sx={{ padding: "100px 20px 20px 20px" }}>
        <TextField
          variant="outlined"
          label="Search..."
          placeholder="Type here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></TextField>
      </Box>
      <Box sx={{ padding: "0 20px 50px 20px" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 30 },
            },
          }}
          pageSizeOptions={[30, 50, 100]}
          checkboxSelection
          onRowSelectionModelChange={(data) => setSelected(data)}
        />
      </Box>
    </Box>
  );
}

export default App;
