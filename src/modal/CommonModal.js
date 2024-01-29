import { Dialog } from "@material-ui/core";
import PropTypes from 'prop-types';

const CommonModal = (props) => {
    return (
        <>
            <Dialog
                open={props.open}
                onClose={() => props.onClose()}
                maxWidth={props.maxWidth || 'md'}
                fullWidth={props.fullWidth || true}
                disableEnforceFocus
            >
                {props.children}
            </Dialog>
        </>
    )
}

CommonModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    maxWidth: PropTypes.string,
    fullWidth: PropTypes.bool
}

export default CommonModal;