import { renderComponent, expect} from '../test_helper'
import Root from '../../components/Root'




// Use "describe" to group together similar tests
describe('root',function(){
    this.timeout(150000);
let component;

    beforeEach(()=>{

        component = renderComponent(Root)

    })


    it("shows the Root element",()=>{
        expect(component.find('.Root')).to.exist
    });



    ( __asyncSkip ? describe.skip : describe)('Mock Login',()=> {
        beforeEach(()=>{
            //component.find('#username').simulate('change',__username)
            //component.find('#userpass').simulate('change',__password)

        })



        it("Change workspace does not exist when not logged in",()=>{
            //expect(component.find('#change_workspace_btn')).to.not.exist

        });






    })

});

