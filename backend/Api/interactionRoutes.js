import express from 'express'
import UserSchema from '../model/UserSchema.js'
import Interaction from '../model/InteractionSchema.js'

const router = express.Router()

router.post("/interaction",async(req,res)=>{
    try {
        const {withUserId,currUserId} = req.body

        const currUser = await UserSchema.findById(currUserId)
        const withUser = await UserSchema.findById(withUserId)
        if(!currUser || !withUser){
            return res.status(400).json({error:"No User found"})
        }
        const interactionUser = Interaction({withUserId,currUserId})
        const interaction = await interactionUser.save()
        currUser.interactions.push(interaction._id)
        withUser.interactions.push(interaction._id)
        await Promise.all([currUser.save(),withUser.save()])
        res.status(200).json(interaction)
    } catch (error) {
        res.status(500).json({error:"Something went wrong"})
    }
})

router.get("/interaction/:userId",async(req,res)=>{
    try {
        const userId = req.params.userId
        const interactUser = await UserSchema.findById(userId).populate({
            path:"interactions",
            options:{sort:{timestamp:-1}},
            populate:{
                path:"withUserId",
                model:"UserSchema"
            },
        }).populate({
            path:"interactions",
            options:{sort:{timestamp:-1}},
            populate:{
                path:"currUserId",
                model:"UserSchema"
            },
        })
        res.status(200).json(interactUser.interactions)
    } catch (error) {
        res.status(500).json({error:"Something went wrong"})
    }
})

router.delete("/interaction/:currUserId/:withUserId",async(req,res)=>{
    try {
        const {withUserId,currUserId} = req.params

        const interactedUser = await Interaction.findOne({
            $or:[
                {withUserId,currUserId},
                {currUserId:withUserId,withUserId:currUserId}
            ]
        })

        if(!interactedUser){
            return res.status(400).json({error:"No Found"})
        }

        const currUser = await UserSchema.findById(currUserId)
        const withUser = await UserSchema.findById(withUserId)

        if(currUser && withUser){
            currUser.interactions.pull(interactedUser._id)
            withUser.interactions.pull(interactedUser._id)
            await Promise.all([currUser.save(),withUser.save()])
        }
        
        const interaction = await Interaction.findOneAndDelete({
            $or:[
                {withUserId,currUserId},
                {currUserId:withUserId,withUserId:currUserId}
            ]
        })
        res.status(200).json({message:"Deleted"})
    } catch (error) {
        res.status(500).json({error:"Something went wrong"})
        
    }
})

export default router