import React from "react";
import { Card, CardContent, CardMedia, Button, Typography, CardActions } from "@mui/material";
import { FaStar } from 'react-icons/fa';
import '../../App.css';

function CustomCard({ item, handleView }) {
  const renderDiscountLabel = () => {
      return <div className="discount-label">{item.message}</div>;
  };

  return (
    <div key={item.id} className='class'>
      <Card>
        <CardMedia component="img" image={item.url} alt="img" />
        <CardContent className="card-content" >
          <Typography gutterBottom variant="h6">
            <p className="carp">{item.topic}</p>
          </Typography>
          <div className="containcard">
            <Typography gutterBottom fontWeight="bold">
              <p>${item.cost}</p>
            </Typography>
            <Typography gutterBottom fontWeight="bold">
              <div className='star-Rating'>
                <FaStar size={15} color="black" />{item.rating}
              </div>
            </Typography>
            <Typography>{renderDiscountLabel()}</Typography>
          </div>
        </CardContent>
        <CardActions className="card-actions">
          <Button
            variant="contained"
            className="card-button"
            fullWidth
            onClick={() => handleView(item.id, item.topic, item.stockcount)}
          >
            {item.stockcount <= 0 ? "Remind" : "View"}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default CustomCard;
