import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import LoadingComponent from "../Loading/Loading";
import "./Checkout.scss";

const Checkout = ({ amount, onSuccess }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: "EUR",
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const name = details.payer.name.given_name;
      //alert(`Transaction completed by ${name}`);
      onSuccess();
    });
  };

  return (
    <div className="checkoutContainer">
      {isPending ? (
        <LoadingComponent />
      ) : (
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "silver",
            shape: "pill",
            height: 48,
            label: "paypal",
            tagline: false,
          }}
          createOrder={onCreateOrder}
          onApprove={onApproveOrder}
          onError={(err) => {
            console.error("PayPal error:", err);
            alert("There was a problem processing the payment.");
          }}
        />
      )}
    </div>
  );
};

export default Checkout;
