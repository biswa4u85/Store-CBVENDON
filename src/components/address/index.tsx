import React, { useState, useEffect } from "react";
import {
    Space,
    Input,
    Button,
} from "@pankod/refine-antd";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBYzmKtwaieGem-mLZ_x2BUrceJU7JIEX0");

type AddressProps = {
    name: any
    formProps: any
};

export const Address: React.FC<AddressProps> = ({ formProps, name }) => {
    const [address, setAddress] = useState<any>({})
    useEffect(() => {
        if (formProps?.initialValues && formProps?.initialValues[name]) {
            let address = formProps?.initialValues[name] ? formProps?.initialValues[name] : {}
            setAddress(address)
            setValue(address?.addres1, false)
        } else {
            getCurrentLocation()
        }
    }, [formProps.initialValues])

    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {},
        debounce: 300,
    });

    const getCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                Geocode.fromLatLng(latitude, longitude).then(
                    (response: any) => {
                        let addressComponents = formatAddress(response.results[0]?.address_components)
                        setAddress({ ...addressComponents, lat: latitude, lng: longitude })
                        if (addressComponents) {
                            (formProps as any).form.setFieldsValue({
                                [name]: { ...addressComponents, lat: latitude, lng: longitude }
                            })
                        }
                    },
                    (error: any) => {
                        console.error(error);
                    }
                );
            })
        }
    }



    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: any) => {
        setValue(e.target.value);
    };

    const formatAddress = (addressData: any) => {
        let data: any = {}
        let address2 = ''
        for (let item of addressData) {
            for (let type of item.types) {
                if (type === 'premise') {
                    address2 = address2 + (item.long_name ? item.long_name + ', ' : '')
                }
                else if (type === 'street_number') {
                    address2 = address2 + (item.long_name ? item.long_name + ', ' : '')
                }
                else if (type === 'route') {
                    address2 = address2 + (item.long_name ? item.long_name + ', ' : '')
                }
                else if (type === 'sublocality_level_2') {
                    address2 = address2 + (item.long_name ? item.long_name + ', ' : '')
                }
                else if (type === 'locality' || type === 'administrative_area_level_2') {
                    data['city'] = item.long_name
                }
                else if (type === 'administrative_area_level_1' || type === 'sublocality_level_1') {
                    data['state'] = item.long_name
                }
                else if (type === 'country') {
                    data['country'] = item.long_name
                }
                else if (type === 'postal_code') {
                    data['postal_code'] = item.long_name
                }
            }
        }
        data['address2'] = address2
        return data
    }

    const handleSelect = ({ description }: any) => () => {
        setValue(description, false);
        clearSuggestions();
        getGeocode({ address: description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            let addressComponents = formatAddress(results[0]?.address_components)
            setAddress({ ...addressComponents, addres1: description, lat, lng })
            if (addressComponents) {
                (formProps as any).form.setFieldsValue({
                    [name]: { ...addressComponents, addres1: description, lat, lng }
                })
            }
        });
    };

    const renderSuggestions = () => data.map((suggestion) => {
        const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;
        return (
            <li style={{ padding: 5, cursor: 'pointer' }} key={place_id} onClick={handleSelect(suggestion)}>
                <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
        );
    });

    const onChange = (key: any, data: any) => {
        if (key) {
            let tempAddress = JSON.parse(JSON.stringify(address))
            tempAddress[key] = data
            setAddress(tempAddress)
            if (key) {
                (formProps as any).form.setFieldsValue({
                    [name]: tempAddress
                })
            }
        }
    }

    return (
        <Space
            direction="vertical"
            style={{
                width: '100%',
                padding: 10,
                borderRadius: 5,
                border: 'solid 1px #ccc'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={() => getCurrentLocation()}>Share your current location</Button>
            </div>
            <div ref={ref}>
                <Input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Address"
                />
                {status === "OK" && <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{renderSuggestions()}</ul>}
            </div>
            <Input placeholder="Full Address" value={address['address2']} onChange={(obj) => onChange('address2', obj.target.value)} />
            <Input placeholder="Block" value={address['block']} onChange={(obj) => onChange('block', obj.target.value)} />
            <Input placeholder="City" value={address['city']} onChange={(obj) => onChange('city', obj.target.value)} />
            <Input placeholder="State" value={address['state']} onChange={(obj) => onChange('state', obj.target.value)} />
            <Input placeholder="Country" value={address['country']} onChange={(obj) => onChange('country', obj.target.value)} />
            <Input placeholder="Code" value={address['postal_code']} onChange={(obj) => onChange('postal_code', obj.target.value)} />
        </Space>

    );
};
